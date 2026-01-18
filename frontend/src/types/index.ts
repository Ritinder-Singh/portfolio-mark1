// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
}

// Skill types
export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: Skill[];
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

// Contact types
export interface ContactInfo {
  type: "email" | "linkedin" | "github";
  label: string;
  value: string;
  url: string;
}

// Social links
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
