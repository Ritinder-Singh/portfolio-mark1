import { NavItem, SkillCategory, Project, ContactInfo } from "@/types";

// TODO: Update with your personal information
export const SITE_CONFIG = {
  // TODO: Change this to your preferred logo text
  logo: "<devPortfolio />",
  name: "John Doe",
  title: "Full Stack Developer",
  email: "johndoe@email.com",
  // TODO: Update CV download link
  cvUrl: "/assets/cv.pdf",
};

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "About", href: "#hero" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

// TODO: Update with your actual skills
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    icon: "code",
    skills: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Python" },
      { name: "Java" },
      { name: "C++" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    icon: "layout",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind" },
      { name: "Redux" },
    ],
  },
  {
    id: "backend",
    title: "Backend & DB",
    icon: "server",
    skills: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    icon: "tool",
    skills: [
      { name: "Git" },
      { name: "Docker" },
      { name: "AWS" },
      { name: "Linux" },
    ],
  },
];

// TODO: Update with your actual projects
export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Data Visualization Dashboard",
    description:
      "Real-time reporting dashboard featuring interactive charts and data visualization. Built with modern web technologies for optimal performance.",
    image: "https://picsum.photos/seed/dashboard/400/250",
    technologies: ["React", "D3.js", "Node.js", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "project-2",
    title: "AI Chat Interface",
    description:
      "OpenAI-powered conversational interface featuring markdown rendering, syntax highlighting, and context retention for seamless interactions.",
    image: "https://picsum.photos/seed/aichat/400/250",
    technologies: ["Next.js", "OpenAI API", "Tailwind", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "project-3",
    title: "E-Commerce API",
    description:
      "Full REST API for e-commerce applications with authentication, payment processing, inventory management, and order tracking.",
    image: "https://picsum.photos/seed/ecommerce/400/250",
    technologies: ["Node.js", "Express", "MongoDB", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

// TODO: Update with your contact information
export const CONTACT_INFO: ContactInfo[] = [
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/johndoe",
    url: "https://linkedin.com/in/johndoe",
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/johndoe",
    url: "https://github.com/johndoe",
  },
  {
    type: "email",
    label: "Email",
    value: "johndoe@email.com",
    url: "mailto:johndoe@email.com",
  },
];

// Hero section animated words
// TODO: Customize the rotating words in the hero section
export const HERO_WORDS = [
  "html",
  "css",
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
    "I'm a passionate frontend developer focused on clean code, beautiful UI, and creating meaningful digital experiences. Welcome to my digital workspace.",
  ctaPrimary: "View Projects",
  ctaSecondary: "Contact Me",
};
