// Single source of truth for brand details — change these and the whole site updates.
export const site = {
  name: "Aurex",
  legalName: "Aurex Studio",
  email: "hello@aurex.studio",
  phone: "+91 00000 00000",
  whatsapp: "910000000000", // international format, digits only
  location: "India · Working worldwide",
  timeZone: "Asia/Kolkata",

  nav: [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Work", to: "/work" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],

  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
};
