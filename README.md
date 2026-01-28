# Portfolio App

A full-stack portfolio application with a React Native/Expo frontend, FastAPI backend, and Next.js admin panel.

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React Native + Expo (Web, iOS, Android) |
| **Backend** | FastAPI + PostgreSQL |
| **Admin Panel** | Next.js 14 |
| **Styling** | NativeWind (Tailwind CSS) |
| **Database** | PostgreSQL |
| **Deployment** | Docker / Northflank |

## Project Structure

```
portfolio-mark1/
├── frontend/          # Expo app (Web + Mobile)
├── backend/           # FastAPI REST API
├── admin/             # Next.js admin panel
├── docker-compose.yml # Docker orchestration
├── nginx.conf         # Reverse proxy config
└── README.md
```

---

## Quick Start (Development)

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Docker (optional)

### 1. Start Database
```bash
cd backend
docker-compose up -d  # Starts PostgreSQL
```

### 2. Start Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed.py  # Seed sample data
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000

### 3. Start Admin Panel
```bash
cd admin
npm install
npm run dev
```
Admin panel runs at: http://localhost:3000

### 4. Start Frontend
```bash
cd frontend
npm install
npx expo start --web
```
Frontend runs at: http://localhost:8081

---

## Deployment

### Option 1: Docker Compose (Self-hosted)

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your production values

# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f
```

**URLs after deployment:**
- Frontend: http://localhost/
- Admin: http://localhost/admin
- API: http://localhost/api/v1

---

### Option 2: Northflank Deployment

#### Step 1: Create Northflank Project
1. Go to [Northflank](https://northflank.com) and create a new project
2. Connect your GitHub repository

#### Step 2: Create PostgreSQL Addon
1. In your project, go to **Addons** → **Create Addon**
2. Select **PostgreSQL**
3. Choose your plan and create
4. Note the connection string from the addon details

#### Step 3: Create Services

**A. Backend Service:**
1. **Services** → **Create Service** → **Build & Deploy**
2. Settings:
   - Name: `backend`
   - Build context: `/backend`
   - Dockerfile: `Dockerfile`
   - Port: `8000`
3. Environment variables (see below)
4. Deploy

**B. Admin Panel Service:**
1. **Services** → **Create Service** → **Build & Deploy**
2. Settings:
   - Name: `admin`
   - Build context: `/admin`
   - Dockerfile: `Dockerfile`
   - Port: `3000`
3. Build arguments:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url/api/v1`
   - `NEXT_PUBLIC_BASE_PATH`: `/admin` (if using path routing)
4. Deploy

**C. Frontend Service:**
1. **Services** → **Create Service** → **Build & Deploy**
2. Settings:
   - Name: `frontend`
   - Build context: `/frontend`
   - Dockerfile: `Dockerfile`
   - Port: `80`
3. Build arguments:
   - `EXPO_PUBLIC_API_URL`: `https://your-backend-url/api/v1`
4. Deploy

#### Step 4: Configure Networking
- Add custom domains or use Northflank-provided URLs
- Set up SSL certificates (automatic with Northflank)

---

## Environment Variables

### Backend (.env)
```env
# Database (from Northflank PostgreSQL addon)
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
SECRET_KEY=generate-a-secure-64-char-random-string

# CORS (comma-separated list of allowed origins)
CORS_ORIGINS=["https://your-frontend-domain.com","https://your-admin-domain.com"]

# App settings
APP_NAME=Portfolio API
API_V1_PREFIX=/api/v1
```

### Admin Panel (Build Args)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
NEXT_PUBLIC_BASE_PATH=  # Set to /admin if using path-based routing
```

### Frontend (Build Args)
```env
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

### Generate Secret Key
```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

---

## Building Mobile Apps

### Prerequisites
- Expo account (free): https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- For iOS: Apple Developer account ($99/year)
- For Android: Google Play Console account ($25 one-time)

### Setup EAS Build
```bash
cd frontend
eas login
eas build:configure
```

### Build Android APK
```bash
# Development APK (for testing)
eas build --platform android --profile preview

# Production AAB (for Play Store)
eas build --platform android --profile production
```

### Build iOS App
```bash
# Development build (for TestFlight)
eas build --platform ios --profile preview

# Production build (for App Store)
eas build --platform ios --profile production
```

### EAS Build Configuration
Create/update `frontend/eas.json`:
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Update App Configuration
Edit `frontend/app.json` before building:
```json
{
  "expo": {
    "name": "Your Portfolio",
    "slug": "your-portfolio",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.portfolio",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourname.portfolio",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

---

## Pre-Deployment Checklist

### Code & Configuration
- [ ] Update `frontend/app.json` with your app name, bundle ID, and version
- [ ] Update `frontend/src/constants/index.ts` with your personal info
- [ ] Replace placeholder images in `frontend/assets/`
- [ ] Update `backend/app/core/config.py` if needed
- [ ] Generate a secure `SECRET_KEY` for production
- [ ] Set correct `CORS_ORIGINS` for your domains

### Database
- [ ] Create production PostgreSQL database
- [ ] Run migrations: `alembic upgrade head`
- [ ] Create admin user for the admin panel
- [ ] Seed initial data or add via admin panel

### Security
- [ ] Use HTTPS for all production URLs
- [ ] Set strong database password
- [ ] Review CORS settings (don't use `*` in production)
- [ ] Set secure cookie settings if using sessions

### Mobile Apps
- [ ] Update app icons (1024x1024 for stores)
- [ ] Update splash screen
- [ ] Set correct bundle identifiers
- [ ] Configure EAS project ID
- [ ] Test on real devices before submitting

### Testing
- [ ] Test API endpoints with production database
- [ ] Test frontend on multiple browsers
- [ ] Test admin panel login and CRUD operations
- [ ] Test mobile app on Android device/emulator
- [ ] Test mobile app on iOS device/simulator
- [ ] Verify images load correctly
- [ ] Test contact form submission

### Deployment
- [ ] Set all environment variables
- [ ] Configure custom domains
- [ ] Set up SSL certificates
- [ ] Configure health checks
- [ ] Set up monitoring/logging
- [ ] Create backup strategy for database

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | List published projects |
| GET | `/api/v1/projects/{slug}` | Get project by slug |
| GET | `/api/v1/skills/categories` | List published skill categories |
| POST | `/api/v1/contact` | Submit contact form |
| GET | `/health` | Health check |

### Admin (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get current user |
| GET | `/api/v1/projects/admin/all` | List all projects |
| POST | `/api/v1/projects` | Create project |
| PATCH | `/api/v1/projects/{id}` | Update project |
| DELETE | `/api/v1/projects/{id}` | Delete project |
| GET | `/api/v1/skills/admin/categories` | List all categories |
| POST | `/api/v1/skills/categories` | Create category |
| PATCH | `/api/v1/skills/categories/{id}` | Update category |
| DELETE | `/api/v1/skills/categories/{id}` | Delete category |
| POST | `/api/v1/skills` | Create skill |
| PATCH | `/api/v1/skills/{id}` | Update skill |
| DELETE | `/api/v1/skills/{id}` | Delete skill |

---

## Admin Panel Features

- **Dashboard**: Overview of projects, skills, and contact submissions
- **Projects**: Create, edit, delete, publish/unpublish, feature projects
- **Skills**: Manage skill categories and individual skills with activate/deactivate
- **Contact**: View and manage contact form submissions
- **Live Preview**: See how projects look on different devices

---

## CI/CD with Jenkins (Raspberry Pi)

The project includes a Jenkins pipeline that integrates with your existing CI/CD infrastructure.

### Features
- Builds and pushes images to `registry.lan:5000`
- Triggers EAS cloud builds for APK (faster than local)
- Deploys staging using Podman
- Email notifications via existing Jenkins config

### Staging URLs (192.168.1.9)
| Service | Port | URL |
|---------|------|-----|
| Frontend | 8084 | http://192.168.1.9:8084 |
| Admin | 3002 | http://192.168.1.9:3002 |
| Backend API | 5003 | http://192.168.1.9:5003/api/v1 |
| PostgreSQL | 5434 | localhost:5434 |

### Jenkins Setup
1. Create new pipeline job pointing to this repo
2. Add `expo-token` credential (from expo.dev)
3. Pipeline uses `Jenkinsfile` automatically

---

## Email Notifications

Contact form submissions automatically send email notifications.

### Configuration (Zoho Mail)
Add these environment variables to your backend:

```env
# Use smtp.zoho.in for India, smtp.zoho.eu for EU
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@zohomail.com
SMTP_PASS=your-zoho-app-password
NOTIFICATION_EMAIL=your-email@zohomail.com
```

### Zoho App Password Setup
1. Log in to Zoho Mail → Settings → Security
2. Enable Two-Factor Authentication (if not already)
3. Go to **App Passwords** → Generate New Password
4. Name it "Portfolio" and copy the password
5. Use this as `SMTP_PASS`

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL is correct
- Run migrations: `alembic upgrade head`

### Frontend can't reach API
- Check CORS_ORIGINS includes frontend URL
- Verify API_URL in frontend config
- Check backend is running and accessible

### Mobile build fails
- Run `eas build:configure` to set up
- Check `app.json` has valid bundle identifiers
- Verify EAS CLI is logged in: `eas whoami`

### Admin panel 404 on routes
- If using basePath, ensure NEXT_PUBLIC_BASE_PATH is set
- Check nginx config routes correctly

---

## License

MIT License - feel free to use this template for your own portfolio!

---

Built with Expo + FastAPI + Next.js
