import { NavItem, ContactInfo } from "@/types";

// TODO: Update with your personal information
export const SITE_CONFIG = {
  // TODO: Change this to your preferred logo text
  logo: "<devPortfolio />",
  name: "Ritinder Singh",
  title: "Full Stack Developer",
  email: "for.ritindersingh@gmail.com",
  cvUrl: "https://backend.ritinder-singh.com/static/cv.pdf",
};

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "About", href: "#hero" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// TODO: Update with your contact information
export const CONTACT_INFO: ContactInfo[] = [
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/ritindersingh",
    url: "https://www.linkedin.com/in/ritindersingh/",
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/Ritinder-Singh",
    url: "https://github.com/Ritinder-Singh",
  },
  {
    type: "email",
    label: "Email",
    value: "for.ritindersingh@gmail.com",
    url: "mailto:for.ritindersingh@gmail.com",
  },
];

// Hero section animated words
// TODO: Customize the rotating words in the hero section
export const HERO_WORDS = [
  "javascript",
  "react",
  "node.js",
  "python",
];

export const HERO_CONTENT = {
  badge: "#OpenToWork",
  headline: "Building the future,",
  headlineHighlight: "one line of code at a time",
  description:
    "I'm a passionate developer focused on clean code, beautiful UI, and creating meaningful digital experiences. Welcome to my digital workspace.",
  ctaPrimary: "View Projects",
  ctaSecondary: "Contact Me",
};
