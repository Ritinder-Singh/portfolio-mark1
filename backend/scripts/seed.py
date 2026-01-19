#!/usr/bin/env python3
"""Seed script to populate the database with sample data."""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal
from app.models import Project, Skill, SkillCategory


def clear_data(db: Session) -> None:
    """Clear existing data."""
    db.query(Skill).delete()
    db.query(SkillCategory).delete()
    db.query(Project).delete()
    db.commit()
    print("Cleared existing data")


def seed_skill_categories(db: Session) -> dict[str, SkillCategory]:
    """Seed skill categories and skills."""
    categories_data = [
        {
            "name": "Languages",
            "slug": "languages",
            "icon": "code",
            "description": "Programming languages I work with",
            "display_order": 1,
            "skills": [
                {"name": "JavaScript", "proficiency": 90},
                {"name": "TypeScript", "proficiency": 85},
                {"name": "Python", "proficiency": 88},
                {"name": "Java", "proficiency": 75},
                {"name": "C++", "proficiency": 70},
            ],
        },
        {
            "name": "Frontend",
            "slug": "frontend",
            "icon": "layout",
            "description": "Frontend technologies and frameworks",
            "display_order": 2,
            "skills": [
                {"name": "React", "proficiency": 92},
                {"name": "Next.js", "proficiency": 88},
                {"name": "Tailwind", "proficiency": 90},
                {"name": "Redux", "proficiency": 80},
            ],
        },
        {
            "name": "Backend & DB",
            "slug": "backend",
            "icon": "server",
            "description": "Backend technologies and databases",
            "display_order": 3,
            "skills": [
                {"name": "Node.js", "proficiency": 85},
                {"name": "Express", "proficiency": 82},
                {"name": "PostgreSQL", "proficiency": 80},
                {"name": "MongoDB", "proficiency": 75},
            ],
        },
        {
            "name": "DevOps & Tools",
            "slug": "devops",
            "icon": "tool",
            "description": "DevOps tools and practices",
            "display_order": 4,
            "skills": [
                {"name": "Git", "proficiency": 90},
                {"name": "Docker", "proficiency": 78},
                {"name": "AWS", "proficiency": 70},
                {"name": "Linux", "proficiency": 82},
            ],
        },
    ]

    categories = {}
    for order, cat_data in enumerate(categories_data):
        skills_data = cat_data.pop("skills")
        category = SkillCategory(**cat_data, is_published=True)
        db.add(category)
        db.flush()  # Get the ID

        for skill_order, skill_data in enumerate(skills_data):
            skill = Skill(
                **skill_data,
                category_id=category.id,
                display_order=skill_order,
                is_published=True,
            )
            db.add(skill)

        categories[cat_data["slug"]] = category

    db.commit()
    print(f"Created {len(categories)} skill categories with skills")
    return categories


def seed_projects(db: Session) -> list[Project]:
    """Seed sample projects."""
    projects_data = [
        {
            "title": "Data Visualization Dashboard",
            "slug": "data-visualization-dashboard",
            "description": "Real-time reporting dashboard featuring interactive charts and data visualization. Built with modern web technologies for optimal performance.",
            "long_description": """A comprehensive data visualization dashboard that transforms raw data into actionable insights through interactive charts and real-time updates.

Key features include:
- Interactive D3.js charts with zoom and filter capabilities
- Real-time data streaming via WebSockets
- Export functionality for reports in PDF and CSV formats
- Role-based access control for different user levels
- Mobile-responsive design for on-the-go monitoring""",
            "technologies": ["React", "D3.js", "Node.js", "PostgreSQL"],
            "images": [
                {
                    "url": "https://picsum.photos/seed/dashboard/800/500",
                    "alt": "Dashboard main view",
                    "is_primary": True,
                }
            ],
            "github_url": "https://github.com/johndoe/dashboard",
            "live_url": "https://dashboard.example.com",
            "is_featured": True,
            "is_published": True,
            "display_order": 1,
        },
        {
            "title": "AI Chat Interface",
            "slug": "ai-chat-interface",
            "description": "OpenAI-powered conversational interface featuring markdown rendering, syntax highlighting, and context retention for seamless interactions.",
            "long_description": """An intelligent chat interface powered by OpenAI's GPT models, designed for natural and productive conversations.

The application features:
- Streaming responses for real-time feedback
- Full markdown support with syntax highlighting for code blocks
- Conversation history with context retention
- Custom system prompts for specialized use cases
- Dark/light mode toggle""",
            "technologies": ["Next.js", "OpenAI API", "Tailwind", "TypeScript"],
            "images": [
                {
                    "url": "https://picsum.photos/seed/aichat/800/500",
                    "alt": "AI Chat Interface",
                    "is_primary": True,
                }
            ],
            "github_url": "https://github.com/johndoe/ai-chat",
            "live_url": "https://aichat.example.com",
            "is_featured": True,
            "is_published": True,
            "display_order": 2,
        },
        {
            "title": "E-Commerce API",
            "slug": "e-commerce-api",
            "description": "Full REST API for e-commerce applications with authentication, payment processing, inventory management, and order tracking.",
            "long_description": """A robust and scalable REST API designed to power e-commerce applications of any size.

API capabilities include:
- JWT-based authentication with refresh tokens
- Stripe integration for payment processing
- Real-time inventory management
- Order lifecycle management
- Admin dashboard API endpoints
- Comprehensive API documentation with Swagger""",
            "technologies": ["Node.js", "Express", "MongoDB", "Stripe"],
            "images": [
                {
                    "url": "https://picsum.photos/seed/ecommerce/800/500",
                    "alt": "E-Commerce API Documentation",
                    "is_primary": True,
                }
            ],
            "github_url": "https://github.com/johndoe/ecommerce-api",
            "live_url": "https://api.shop.example.com",
            "is_featured": True,
            "is_published": True,
            "display_order": 3,
        },
        {
            "title": "Task Management App",
            "slug": "task-management-app",
            "description": "A Kanban-style task management application with drag-and-drop functionality, real-time collaboration, and team workspaces.",
            "long_description": """A modern task management solution designed for teams and individuals who want to stay organized and productive.

Features include:
- Drag-and-drop Kanban boards
- Real-time collaboration with live updates
- Team workspaces with role-based permissions
- Due date reminders and notifications
- Time tracking and productivity analytics""",
            "technologies": ["React", "Firebase", "Tailwind", "DnD Kit"],
            "images": [
                {
                    "url": "https://picsum.photos/seed/taskapp/800/500",
                    "alt": "Task Management Board",
                    "is_primary": True,
                }
            ],
            "github_url": "https://github.com/johndoe/taskmanager",
            "live_url": "https://tasks.example.com",
            "is_featured": False,
            "is_published": True,
            "display_order": 4,
        },
        {
            "title": "Weather Dashboard",
            "slug": "weather-dashboard",
            "description": "A beautiful weather application with location-based forecasts, interactive maps, and severe weather alerts.",
            "long_description": """Stay informed about weather conditions with this comprehensive weather dashboard.

Key features:
- Current conditions and 7-day forecasts
- Interactive radar and satellite maps
- Severe weather alerts and notifications
- Multiple location support
- Historical weather data visualization""",
            "technologies": ["React", "OpenWeather API", "Mapbox", "Chart.js"],
            "images": [
                {
                    "url": "https://picsum.photos/seed/weather/800/500",
                    "alt": "Weather Dashboard",
                    "is_primary": True,
                }
            ],
            "github_url": "https://github.com/johndoe/weather",
            "live_url": None,
            "is_featured": False,
            "is_published": True,
            "display_order": 5,
        },
    ]

    projects = []
    for project_data in projects_data:
        project = Project(**project_data)
        db.add(project)
        projects.append(project)

    db.commit()
    print(f"Created {len(projects)} projects")
    return projects


def main():
    """Main seed function."""
    print("Starting database seed...")
    print("-" * 40)

    db = SessionLocal()
    try:
        # Clear existing data
        clear_data(db)

        # Seed data
        seed_skill_categories(db)
        seed_projects(db)

        print("-" * 40)
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
