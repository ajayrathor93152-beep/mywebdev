import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import ContactForm from "@/components/contact/ContactForm";
import PageIntro from "@/components/ui/PageIntro";
import { site } from "@/config/site";
import { ease, fadeUp, stagger } from "@/lib/motion";

const channels = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${site.whatsapp}`, external: true },
  { icon: Phone, label: "Call", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
];

const nextSteps = [
  "We read every message and reply within one business day.",
  "A free 20-minute call to understand your goals.",
  "A fixed quote and timeline in writing — no surprises.",
];

export default function Contact() {
  const [params] = useSearchParams();

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            Tell us what you&apos;re <em className="font-serif font-normal italic text-volt-ink">building.</em>
          </>
        }
      >
        <p>A few details are all we need to come back with honest advice and a clear quote.</p>
      </PageIntro>

      <section className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <motion.aside
          variants={stagger(0.08, 0.3)}
          initial="hidden"
          animate="show"
          className="space-y-10 lg:col-span-4"
        >
          <ul className="space-y-3">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <motion.li key={label} variants={fadeUp}>
                <a
                  href={href}
                  {...(external && { target: "_blank", rel: "noreferrer" })}
                  className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors duration-300 hover:border-fg/40"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-colors duration-300 group-hover:bg-volt group-hover:text-ink">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block">{label}</span>
                    <span className="block truncate">{value}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-fg" />
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={fadeUp}>
            <p className="eyebrow mb-5">What happens next</p>
            <ol className="space-y-5">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-xs text-volt-ink">0{i + 1}</span>
                  <span className="text-fg/80">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
          className="lg:col-span-8"
        >
          <ContactForm initialService={params.get("service") ?? ""} />
        </motion.div>
      </section>
    </>
  );
}
