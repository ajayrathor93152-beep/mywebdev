import { AlertCircle, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { services } from "@/config/services";
import { api, getApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

// Mirrors server/src/validators/inquiry.schema.js so most mistakes are caught before a round-trip.
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 2000;

const SERVICE_OPTIONS = [...services.map((s) => ({ key: s.key, label: s.title })), { key: "other", label: "Something else" }];

const EMPTY = { name: "", email: "", phone: "", service: "", message: "", website: "" };

function validate(v) {
  const e = {};
  const name = v.name.trim();
  if (name.length < 2) e.name = "Please enter your name";
  else if (name.length > 80 || !NAME_RE.test(name)) e.name = "Please enter a valid name";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email";
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = "Please enter a valid phone number";
  if (!v.service) e.service = "Pick the closest match";
  const msg = v.message.trim().length;
  if (msg < MESSAGE_MIN) e.message = `Tell us a little more (${MESSAGE_MIN}+ characters)`;
  else if (msg > MESSAGE_MAX) e.message = `Please keep it under ${MESSAGE_MAX} characters`;
  return e;
}

function FieldError({ id, message }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease }}
          className="overflow-hidden text-sm text-danger"
        >
          <span className="block pt-2">{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({ label, hint, error, children, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="font-normal text-muted">{hint}</span>}
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

const inputClass = (error) =>
  cn(
    "block w-full rounded-2xl border bg-bg px-4 text-[0.95rem] text-fg outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60",
    "focus:border-fg focus:shadow-[0_0_0_4px_var(--line)]",
    error ? "border-danger" : "border-line"
  );

function Success({ name, onReset }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex min-h-[34rem] flex-col items-center justify-center text-center"
      role="status"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
        className="relative grid size-20 place-items-center rounded-full bg-volt text-ink"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-volt"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <svg viewBox="0 0 24 24" className="relative size-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease, delay: 0.35 }} />
        </svg>
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.45 }}
        className="mt-8 text-3xl font-medium tracking-[-0.035em]"
      >
        Thanks, {name.split(" ")[0]} — message received.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.55 }}
        className="mt-3 max-w-sm text-muted"
      >
        We&apos;ve sent a confirmation to your inbox and will reply within one business day.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        <RotateCcw className="size-4" /> Send another message
      </motion.button>
    </motion.div>
  );
}

export default function ContactForm({ initialService = "" }) {
  const uid = useId();
  const [values, setValues] = useState({
    ...EMPTY,
    service: SERVICE_OPTIONS.some((o) => o.key === initialService) ? initialService : "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [formError, setFormError] = useState("");

  const id = (name) => `${uid}-${name}`;
  const shown = (name) => (touched[name] || status === "error" ? errors[name] : undefined);

  const update = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    // Re-validate live once a field has been visited, so errors clear as the user fixes them.
    if (touched[name]) setErrors(validate(next));
  };
  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const clientErrors = validate(values);
    setErrors(clientErrors);
    setTouched({ name: true, email: true, phone: true, service: true, message: true });
    if (Object.keys(clientErrors).length) {
      setStatus("error");
      setFormError("Please fix the highlighted fields.");
      document.getElementById(id(Object.keys(clientErrors)[0]))?.focus();
      return;
    }

    setStatus("submitting");
    setFormError("");
    try {
      await api.post("/inquiries", {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service: values.service,
        message: values.message.trim(),
        website: values.website, // honeypot
      });
      setStatus("success");
    } catch (err) {
      const { message, fields } = getApiError(err);
      // Server returns arrays per field (Zod flatten) — show the first message for each.
      const serverErrors = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v?.[0]]));
      setErrors(serverErrors);
      setStatus("error");
      setFormError(
        Object.keys(serverErrors).length
          ? "Please fix the highlighted fields."
          : message === "Network error"
            ? "We couldn't reach the server. Check your connection and try again."
            : message
      );
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setFormError("");
  };

  const msgLen = values.message.trim().length;

  return (
    <div className="rounded-[32px] border border-line bg-surface p-6 md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <Success name={values.name.trim()} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field id={id("name")} label="Name" error={shown("name")}>
                <input
                  id={id("name")}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update("name")}
                  onBlur={blur("name")}
                  maxLength={80}
                  placeholder="Your full name"
                  aria-invalid={!!shown("name")}
                  aria-describedby={shown("name") ? `${id("name")}-error` : undefined}
                  className={cn(inputClass(shown("name")), "h-13")}
                />
              </Field>
              <Field id={id("email")} label="Email" error={shown("email")}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  maxLength={254}
                  placeholder="you@company.com"
                  aria-invalid={!!shown("email")}
                  aria-describedby={shown("email") ? `${id("email")}-error` : undefined}
                  className={cn(inputClass(shown("email")), "h-13")}
                />
              </Field>
            </div>

            <Field id={id("phone")} label="Phone / WhatsApp" hint="Optional" error={shown("phone")}>
              <input
                id={id("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={values.phone}
                onChange={update("phone")}
                onBlur={blur("phone")}
                maxLength={20}
                placeholder="+91 98765 43210"
                aria-invalid={!!shown("phone")}
                aria-describedby={shown("phone") ? `${id("phone")}-error` : undefined}
                className={cn(inputClass(shown("phone")), "h-13")}
              />
            </Field>

            <fieldset>
              <legend className="mb-3 text-sm font-medium">What do you need?</legend>
              <div
                id={id("service")}
                tabIndex={-1}
                className="grid gap-2 outline-none sm:grid-cols-2"
                aria-describedby={shown("service") ? `${id("service")}-error` : undefined}
              >
                {SERVICE_OPTIONS.map((opt) => {
                  const checked = values.service === opt.key;
                  return (
                    <label
                      key={opt.key}
                      className={cn(
                        "relative flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm transition-colors duration-300",
                        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--ring)]",
                        checked ? "border-fg text-fg" : "border-line text-fg/80 hover:border-fg/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={opt.key}
                        checked={checked}
                        onChange={(e) => {
                          update("service")(e);
                          setTouched((t) => ({ ...t, service: true }));
                          setErrors(validate({ ...values, service: e.target.value }));
                        }}
                        className="sr-only"
                      />
                      {checked && (
                        <motion.span
                          layoutId={`${uid}-service-pill`}
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-2xl bg-fg/[0.05]"
                        />
                      )}
                      <span
                        className={cn(
                          "relative grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                          checked ? "border-volt bg-volt text-ink" : "border-line"
                        )}
                      >
                        {checked && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      <span className="relative">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              <FieldError id={`${id("service")}-error`} message={shown("service")} />
            </fieldset>

            <Field
              id={id("message")}
              label="Project details"
              hint={
                <span className={cn("tabular-nums", msgLen > MESSAGE_MAX && "text-danger")}>
                  {msgLen}/{MESSAGE_MAX}
                </span>
              }
              error={shown("message")}
            >
              <textarea
                id={id("message")}
                name="message"
                rows={5}
                value={values.message}
                onChange={update("message")}
                onBlur={blur("message")}
                placeholder="What are you building, who is it for, and when would you like to launch?"
                aria-invalid={!!shown("message")}
                aria-describedby={shown("message") ? `${id("message")}-error` : undefined}
                className={cn(inputClass(shown("message")), "resize-y py-3.5")}
                data-lenis-prevent
              />
            </Field>

            {/* Honeypot: hidden from people and screen readers, irresistible to bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={update("website")} />
              </label>
            </div>

            <AnimatePresence initial={false}>
              {status === "error" && formError && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", x: [0, -8, 8, -4, 4, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <p className="flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm">
                    <AlertCircle className="size-4 shrink-0 text-danger" />
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
              <p className="text-xs text-muted">We reply within one business day. No spam, ever.</p>
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex h-14 items-center gap-4 rounded-full bg-volt pl-7 pr-2 font-medium text-ink transition-shadow duration-500 hover:shadow-[0_10px_40px_-10px_var(--volt)] disabled:cursor-wait disabled:opacity-80"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={status === "submitting" ? "sending" : "send"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                  </motion.span>
                </AnimatePresence>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-volt">
                  {status === "submitting" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-rotate-45" />
                  )}
                </span>
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
