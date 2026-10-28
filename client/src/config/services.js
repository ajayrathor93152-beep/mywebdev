// Service catalogue. `key` must match SERVICES in server/src/validators/inquiry.schema.js
// so "Start a project" can preselect the service on the contact form.
// Wrap a word in *asterisks* in a tagline to give it the serif-italic accent.
export const services = [
  {
    key: "website",
    short: "Websites",
    title: "Custom Website Design & Development",
    tagline: "A site that feels like *yours* — not a theme.",
    description:
      "From a single-page launch site to a full company presence. We design from a blank canvas and hand-build it in React for speed, SEO and easy updates.",
    deliverables: [
      "Custom UI design, desktop + mobile",
      "Hand-coded React / Next.js build",
      "On-page SEO, meta tags & sitemap",
      "CMS so you can edit content yourself",
      "Analytics & conversion tracking",
      "Domain, hosting & SSL setup",
    ],
    idealFor: "Service businesses, personal brands, clinics, studios, real estate",
    stack: ["React", "Next.js", "Tailwind", "Headless CMS"],
    timeline: "2–4 weeks",
  },
  {
    key: "ecommerce",
    short: "E-Commerce",
    title: "E-Commerce Solutions",
    tagline: "Stores built to *sell*, not just sit pretty.",
    description:
      "Fast product pages, a friction-free cart and checkout, and payments that just work — plus an admin panel your team will actually enjoy using.",
    deliverables: [
      "Product catalogue with filters & search",
      "Cart, wishlist & guest checkout",
      "Razorpay, Stripe & UPI payments",
      "Orders, inventory & coupon management",
      "Shipping & invoice integrations",
      "Order & abandoned-cart emails",
    ],
    idealFor: "D2C brands, boutiques, home businesses ready to scale",
    stack: ["React", "Node.js", "MongoDB", "Razorpay", "Stripe"],
    timeline: "4–8 weeks",
  },
  {
    key: "restaurant",
    short: "Cafés & QR menus",
    title: "Cafe & Restaurant Websites + Smart QR Menus",
    tagline: "Menus guests *love* to scroll.",
    description:
      "A mouth-watering website plus a QR-powered digital menu you update in seconds — sold out, new special, price change. No reprinting, ever.",
    deliverables: [
      "Signature website with gallery & story",
      "Smart QR menu with categories & dietary tags",
      "Instant menu edits from your phone",
      "Table booking & enquiry flows",
      "Maps, reviews & WhatsApp ordering",
      "Print-ready QR table cards",
    ],
    idealFor: "Cafés, restaurants, cloud kitchens, bakeries, bars",
    stack: ["React", "Node.js", "MongoDB", "WhatsApp"],
    timeline: "1–3 weeks",
  },
  {
    key: "mvp",
    short: "Startup MVPs",
    title: "Startup & SaaS MVP Development",
    tagline: "From napkin sketch to *paying users*.",
    description:
      "We help founders scope ruthlessly, design the core flow and ship a production-grade MVP — auth, payments, analytics — so you can validate fast and raise with confidence.",
    deliverables: [
      "Scoping & feature prioritisation",
      "Clickable prototype for early feedback",
      "Secure auth, roles & accounts",
      "Subscriptions & billing",
      "Admin panel & product analytics",
      "A scalable codebase you fully own",
    ],
    idealFor: "Pre-seed & seed founders, internal tools, side projects going pro",
    stack: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    timeline: "6–12 weeks",
  },
  {
    key: "dashboard",
    short: "Dashboards & UI/UX",
    title: "Custom Dashboards & UI/UX Design",
    tagline: "Complex data, *calm* interfaces.",
    description:
      "We turn spreadsheets and scattered tools into focused dashboards and design systems — research-led UX, polished UI and the front-end to bring it to life.",
    deliverables: [
      "UX research & user-flow mapping",
      "Wireframes to high-fidelity UI",
      "Design system & component library",
      "Interactive charts & real-time data",
      "Role-based admin panels",
      "Dev-ready handoff or full build",
    ],
    idealFor: "SaaS products, operations teams, analytics-heavy businesses",
    stack: ["Figma", "React", "TypeScript", "WebSockets"],
    timeline: "3–8 weeks",
  },
];

export const processSteps = [
  {
    title: "Discover",
    when: "Week 0",
    body: "A call to understand your business, customers and goals. You leave with a clear scope, timeline and a fixed quote.",
  },
  {
    title: "Design",
    when: "Weeks 1–2",
    body: "Moodboard first, then real screens in Figma. You review actual designs, not vague concepts — revisions included.",
  },
  {
    title: "Build",
    when: "Weeks 2–6",
    body: "Hand-coded and tested on real devices, with a live staging link so you watch it come together day by day.",
  },
  {
    title: "Launch & grow",
    when: "Ongoing",
    body: "Go-live, SEO, analytics and a handover session. Then 30 days of free support and optional care plans.",
  },
];

export const included = [
  "Mobile-first, fully responsive",
  "Core Web Vitals optimised",
  "SEO-ready structure",
  "Accessibility (WCAG AA)",
  "Analytics setup",
  "SSL & security hardening",
  "100% code ownership",
  "30 days free support",
];

export const faqs = [
  {
    q: "How much does a project cost?",
    a: "Every project is quoted after a short discovery call, based on real scope — not a one-size package. You get a fixed price in writing before any work starts, so there are no surprises.",
  },
  {
    q: "How long will it take?",
    a: "Most cafe sites and menus launch in 1–3 weeks, business websites in 2–4, stores in 4–8 and MVPs in 6–12. You'll get a dated timeline with your quote.",
  },
  {
    q: "Do I own the website and the code?",
    a: "Yes. Once the final invoice is paid, the design files, source code, domain and hosting accounts are entirely yours. No lock-in.",
  },
  {
    q: "Can I update content myself?",
    a: "Absolutely. Sites come with a simple editor for text, images, products or menu items — no developer needed for day-to-day changes.",
  },
  {
    q: "What happens after launch?",
    a: "You get 30 days of free fixes and tweaks. After that, optional monthly care plans cover updates, backups, monitoring and small improvements.",
  },
  {
    q: "Will my site rank on Google?",
    a: "Every build ships with technical SEO, fast load times and clean structure — the foundations Google rewards. Nobody can honestly guarantee rankings, but we make sure nothing on our side holds you back.",
  },
];
