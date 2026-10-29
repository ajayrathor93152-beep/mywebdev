import { services } from "./services";

// One live sample per service. `key` matches the service key and is the URL slug: /work/:key.
// Each sample is a fictional brand, so the colours below are that brand's — not ours.
const sampleMeta = {
  website: {
    brand: "Northfold & Co.",
    kind: "Corporate / agency site",
    blurb: "A calm, editorial agency site with parallax, scroll-linked reveals and a case-study rail.",
    features: ["Scroll-linked parallax", "Animated counters", "Case-study rail"],
    swatch: ["#111318", "#e8e4dc", "#c8a46a"],
  },
  ecommerce: {
    brand: "Kiln Goods",
    kind: "Online storefront",
    blurb: "A ceramics store with filters, product cards, quick-add and a slide-out cart that really adds up.",
    features: ["Live filters", "Slide-out cart", "Quantity & totals"],
    swatch: ["#f6f1ea", "#1c1a17", "#d0643a"],
  },
  restaurant: {
    brand: "Ember & Oak",
    kind: "Café & restaurant",
    blurb: "A warm, appetising site with a tabbed menu, chef's specials and a table-booking flow.",
    features: ["Tabbed menu", "Dietary tags", "Reservation flow"],
    swatch: ["#1f140e", "#f3e6d3", "#e0913a"],
  },
  mvp: {
    brand: "Pipeline",
    kind: "SaaS landing page",
    blurb: "A high-converting launch page: crisp value prop, feature grid, pricing toggle and CTAs everywhere.",
    features: ["Monthly / yearly pricing", "Feature grid", "Email capture"],
    swatch: ["#0b1220", "#ffffff", "#5b8cff"],
  },
  dashboard: {
    brand: "Orbit Analytics",
    kind: "Admin dashboard",
    blurb: "A working analytics dashboard: sidebar nav, KPI counters, interactive charts and its own dark mode.",
    features: ["Light / dark mode", "Hover tooltips", "Count-up KPIs"],
    swatch: ["#0f1115", "#f5f6f8", "#7c9cff"],
  },
};

export const samples = services.map((service) => ({
  ...sampleMeta[service.key],
  key: service.key,
  title: service.title,
  short: service.short,
}));

export const getSample = (key) => samples.find((s) => s.key === key);
