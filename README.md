# Portfolio Website

A modern, responsive portfolio website built with React Native and Expo, featuring a unified codebase for Web, iOS, and Android platforms.

## Preview

| Desktop | Tablet | Mobile |
|---------|--------|--------|
| Full-width layout | Responsive medium layout | Mobile-optimized |

## Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile and web development
- **Expo Router** - File-based routing for navigation
- **NativeWind** (Tailwind CSS) - Utility-first styling
- **TypeScript** - Type-safe development
- **React Native Reanimated** - Smooth animations

### Supported Platforms
- Web (Desktop & Mobile browsers)
- iOS (iPhone & iPad)
- Android (Phones & Tablets)

## Project Structure

```
portfolio-mark1/
├── frontend/                 # React Native Expo app
│   ├── app/                 # Expo Router pages
│   │   ├── _layout.tsx      # Root layout
│   │   ├── index.tsx        # Home page
│   │   └── projects/
│   │       ├── index.tsx    # All Projects page
│   │       └── [id].tsx     # Project Detail page
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── constants/       # App constants and data
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images, fonts, etc.
│   ├── tailwind.config.js   # Tailwind/NativeWind config
│   └── package.json
├── backend/                  # Backend API (TBD)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK

### Installation

```bash
# Clone the repository
git clone https://github.com/Ritinder-Singh/portfolio-mark1.git
cd portfolio-mark1

# Install frontend dependencies
cd frontend
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on specific platforms
npm run web       # Open in web browser
npm run android   # Open in Android emulator/device
npm run ios       # Open in iOS simulator (macOS only)
```

## Features

- **Responsive Design** - Adapts seamlessly across desktop, tablet, and mobile
- **Single Page Application** - Smooth scrolling navigation
- **Animated Hero Section** - Dynamic typing animation effect
- **Technical Skills Showcase** - Categorized skills display
- **Project Portfolio** - Featured projects with descriptions and tech stacks
- **Contact Form** - Easy way to get in touch
- **Cross-Platform** - One codebase, multiple platforms

## Sections

1. **Header** - Navigation with logo and CTA buttons
2. **Hero** - Introduction with animated text
3. **Technical Arsenal** - Skills organized by category
4. **Featured Projects** - Showcase of work with images and details
5. **Contact** - Contact form and social links
6. **Footer** - Copyright and credits

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0f172a` | Main dark background |
| Secondary BG | `#1e293b` | Cards and sections |
| Primary (Teal) | `#14b8a6` | Accent color, CTAs |
| Text Primary | `#f8fafc` | Main text |
| Text Secondary | `#94a3b8` | Muted text |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, skills, featured projects, and contact |
| `/projects` | All projects page with technology filtering |
| `/projects/[id]` | Individual project detail page |

## Customization

### Update Your Information
Edit `frontend/src/constants/data.ts` to customize:
- Logo text and site name
- Navigation items
- Skills and categories
- Projects with descriptions, images, and links
- Contact information

All customizable fields are marked with `// TODO` comments.

## Future Enhancements (TODOs)

### Rich Project Detail Pages
The project detail page (`app/projects/[id].tsx`) is set up for expanded content. To add richer project pages, extend the `Project` type in `src/types/index.ts`:

```typescript
interface Project {
  // Existing fields...

  // Add these for rich detail pages:
  challenges?: string;        // Challenges faced during development
  approach?: string;          // Your solution approach
  features?: string[];        // List of key features
  screenshots?: string[];     // Additional images for gallery
  results?: string;           // Impact/metrics achieved
  relatedProjects?: string[]; // IDs of related projects
}
```

### Backend Integration
- Contact form submission endpoint
- Content Management System (CMS) for projects
- Analytics tracking
- CV/Resume download handling

## License

MIT License - feel free to use this template for your own portfolio!

---

Built with React Native + Expo + Expo Router
