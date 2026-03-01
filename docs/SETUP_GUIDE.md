# Pet Translator - Complete Setup Guide

## Quick Start (All Services)

### Prerequisites
- Node.js 20 LTS
- Python 3.11+
- PostgreSQL 15+
- Redis 7+ (optional)
- React Native CLI
- Xcode 15+ (for iOS)
- Android Studio (for Android)

---

## 1. Database Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb pet_translator

# Or use Docker
docker run -d \
  --name pet-translator-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=pet_translator \
  -p 5432:5432 \
  postgres:15
```

---

## 2. Backend Setup

```bash
cd backend

# Install dependencies (already done if you see node_modules)
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

**Backend runs on:** http://localhost:3000
**API Docs:** http://localhost:3000/docs

---

## 3. ML Service Setup

```bash
cd ml-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start ML service
uvicorn src.main:app --reload --port 8000
```

**ML Service runs on:** http://localhost:8000
**Health Check:** http://localhost:8000/health

---

## 4. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# iOS Setup (macOS only)
cd ios
pod install
cd ..
npx react-native run-ios

# Android Setup
npx react-native run-android
```

---

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: ML Service
```bash
cd ml-service
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

### Terminal 3: Mobile
```bash
cd mobile
npx react-native start
```

---

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### ML Service Test
```bash
curl -X POST http://localhost:8000/predict \
  -F "audio=@test_audio.wav"
```

### API Test
```bash
curl http://localhost:3000/api/health
```

---

## Production Deployment

### Backend (Docker)
```bash
cd backend
docker build -t pet-translator-backend .
docker run -p 3000:3000 pet-translator-backend
```

### ML Service (Docker)
```bash
cd ml-service
docker build -t pet-translator-ml .
docker run -p 8000:8000 pet-translator-ml
```

### Mobile (Production Build)
```bash
# iOS Release
cd mobile/ios
xcodebuild -scheme PetTranslator -configuration Release

# Android Release
cd mobile/android
./gradlew assembleRelease
```

---

## App Store Submission

See `docs/deployment/APP_STORE_GUIDE.md` for detailed submission instructions.

Quick checklist:
- [ ] App icons (all sizes)
- [ ] Screenshots (all devices)
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] App preview video
- [ ] Description and keywords
- [ ] Pricing set
- [ ] Test flight / internal testing

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `brew services list | grep postgresql`
- Verify DATABASE_URL in .env
- Check port 3000 isn't in use: `lsof -i :3000`

### ML Service won't start
- Verify Python 3.11+: `python3 --version`
- Check virtual environment is activated
- Install libsndfile: `brew install libsndfile`

### Mobile app won't build
- Clear cache: `npx react-native clean`
- Reinstall pods: `cd ios && pod deintegrate && pod install`
- Check Xcode/Android Studio versions

### Database connection errors
- Verify PostgreSQL is accepting connections
- Check firewall settings
- Test with: `psql $DATABASE_URL`

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/pet_translator"
JWT_SECRET="your-secret-key"
PORT=3000
ML_SERVICE_URL="http://localhost:8000"
```

### Mobile (.env)
```
API_URL="http://localhost:3000"
```

---

## Support

- Issues: https://github.com/yourusername/pet-translator/issues
- Email: support@pettranslator.app
- Documentation: See `/docs` folder

---

## License

MIT License - See LICENSE file
