# Portfolio App - TODO List

## Pre-Deployment Tasks

### Code & Configuration
- [ ] Update `frontend/app.json`:
  - [ ] Change `name` to your portfolio name
  - [ ] Change `slug` to your unique slug
  - [ ] Update `ios.bundleIdentifier` (e.g., `com.yourname.portfolio`)
  - [ ] Update `android.package` (e.g., `com.yourname.portfolio`)
- [ ] Update `frontend/src/constants/index.ts` with your info:
  - [ ] Your name and title
  - [ ] Social media links
  - [ ] Contact information
- [ ] Replace placeholder images:
  - [ ] `frontend/assets/icon.png` (1024x1024)
  - [ ] `frontend/assets/splash-icon.png`
  - [ ] `frontend/assets/adaptive-icon.png`
  - [ ] `frontend/assets/favicon.png`
- [ ] Generate production SECRET_KEY:
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(64))"
  ```

### Northflank Setup
- [ ] Create Northflank account
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Create PostgreSQL addon
- [ ] Note database connection string

### Deploy Backend
- [ ] Create backend service in Northflank
- [ ] Set build context: `/backend`
- [ ] Set Dockerfile path: `Dockerfile`
- [ ] Set port: `8000`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (from PostgreSQL addon)
  - [ ] `SECRET_KEY` (generated above)
  - [ ] `CORS_ORIGINS` (will update after getting frontend URLs)
  - [ ] `APP_NAME`
  - [ ] `API_V1_PREFIX`
- [ ] Deploy and note the URL

### Deploy Admin Panel
- [ ] Create admin service in Northflank
- [ ] Set build context: `/admin`
- [ ] Set Dockerfile path: `Dockerfile`
- [ ] Set port: `3000`
- [ ] Add build arguments:
  - [ ] `NEXT_PUBLIC_API_URL=https://backend-url/api/v1`
- [ ] Deploy and note the URL

### Deploy Frontend
- [ ] Create frontend service in Northflank
- [ ] Set build context: `/frontend`
- [ ] Set Dockerfile path: `Dockerfile`
- [ ] Set port: `80`
- [ ] Add build arguments:
  - [ ] `EXPO_PUBLIC_API_URL=https://backend-url/api/v1`
- [ ] Deploy and note the URL

### Post-Deployment
- [ ] Update backend CORS_ORIGINS with frontend and admin URLs
- [ ] Redeploy backend
- [ ] Run database migrations (if needed)
- [ ] Create admin user:
  ```bash
  # Connect to backend container and run:
  # python -c "from app.core.database import SessionLocal; ..."
  ```
- [ ] Add initial content via admin panel
- [ ] Test all functionality

### Mobile App Build
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Configure project: `eas build:configure`
- [ ] Update `frontend/eas.json` with production API URL
- [ ] Build Android APK: `eas build --platform android --profile preview`
- [ ] Build iOS (requires Apple Developer account): `eas build --platform ios --profile preview`
- [ ] Test on real devices

### App Store Submission (Optional)
- [ ] Create Google Play Console account ($25)
- [ ] Create Apple Developer account ($99/year)
- [ ] Prepare store listings:
  - [ ] App description
  - [ ] Screenshots (various sizes)
  - [ ] Feature graphic
  - [ ] Privacy policy URL
- [ ] Build production versions:
  - [ ] `eas build --platform android --profile production`
  - [ ] `eas build --platform ios --profile production`
- [ ] Submit to stores:
  - [ ] `eas submit --platform android`
  - [ ] `eas submit --platform ios`

---

## Feature Backlog

### High Priority
- [ ] Add contact form email notifications
- [ ] Add analytics tracking
- [ ] Add SEO meta tags for web
- [ ] Add social sharing previews (Open Graph)

### Medium Priority
- [ ] Add dark/light theme toggle
- [ ] Add blog/articles section
- [ ] Add testimonials section
- [ ] Add resume/CV download

### Low Priority
- [ ] Add animations/transitions
- [ ] Add multi-language support
- [ ] Add accessibility improvements
- [ ] Add PWA support for web

---

## Useful Commands

```bash
# Development
cd backend && uvicorn app.main:app --reload
cd admin && npm run dev
cd frontend && npx expo start --web

# Database
cd backend && alembic upgrade head
cd backend && python scripts/seed.py

# Docker
docker-compose up --build -d
docker-compose logs -f
docker-compose down

# Mobile builds
cd frontend
eas build --platform android --profile preview  # APK
eas build --platform ios --profile preview      # iOS
eas build --platform all --profile production   # Both for stores
```
