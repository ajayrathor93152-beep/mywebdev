import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

const row = (label, value) =>
  value
    ? `<tr><td style="padding:6px 16px 6px 0;color:#6a675e">${label}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`
    : "";

/** Fires the internal notification + an auto-reply to the client. Failures are logged, never thrown. */
export async function notifyNewInquiry(inquiry) {
  if (!transporter) {
    console.info(`[mail] SMTP not configured — skipped notification for inquiry ${inquiry._id}`);
    return;
  }

  const jobs = [
    env.MAIL_TO &&
    transporter.sendMail({
      from: env.MAIL_FROM,
      to: env.MAIL_TO,
      replyTo: inquiry.email,
      subject: `New inquiry · ${inquiry.name} · ${inquiry.service}`,
      text: [
        `Name: ${inquiry.name}`,
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone ?? "—"}`,
        `Company: ${inquiry.company ?? "—"}`,
        `Service: ${inquiry.service}`,
        `Budget: ${inquiry.budget}`,
        "",
        inquiry.message,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;font-size:14px;color:#0e0e0c">
          <h2 style="margin:0 0 16px">New project inquiry</h2>
          <table>${row("Name", inquiry.name)}${row("Email", inquiry.email)}${row("Phone", inquiry.phone)}${row("Company", inquiry.company)}${row("Service", inquiry.service)}${row("Budget", inquiry.budget)}</table>
          <p style="white-space:pre-wrap;margin-top:16px;padding:16px;background:#f4f2ec;border-radius:12px">${escapeHtml(inquiry.message)}</p>
        </div>`,
    }),
    transporter.sendMail({
      from: env.MAIL_FROM,
      to: inquiry.email,
      subject: "We've got your message",
      text: `Hi ${inquiry.name},\n\nThanks for reaching out — we've received your inquiry and will reply within one business day.\n\n— The team`,
    }),
  ];

  const results = await Promise.allSettled(jobs.filter(Boolean));
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => console.error("[mail] send failed:", r.reason?.message));
}
