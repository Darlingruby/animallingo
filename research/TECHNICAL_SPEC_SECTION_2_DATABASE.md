# Technical Specification - Section 2: Database Schema & API Design

## 1. Database Schema (PostgreSQL/Prisma)

### Prisma Schema Definition

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String    @map("password_hash")
  profileImage  String?   @map("profile_image")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLoginAt   DateTime? @map("last_login_at")
  isActive      Boolean   @default(true) @map("is_active")
  
  pets          Pet[]
  apiKeys       ApiKey[]
  
  @@map("users")
}

model Pet {
  id            String   @id @default(uuid())
  ownerId       String   @map("owner_id")
  name          String
  species       String   // dog, cat, bird, etc.
  breed         String?
  age           Int?
  gender        String?
  profileImage  String?  @map("profile_image")
  voiceProfile  Json?    @map("voice_profile") // acoustic features
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  owner         User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  translations  Translation[]
  trainingSessions TrainingSession[]
  
  @@map("pets")
}

model Translation {
  id              String   @id @default(uuid())
  petId           String   @map("pet_id")
  audioUrl        String   @map("audio_url")
  durationMs      Int      @map("duration_ms")
  predictedEmotion String  @map("predicted_emotion")
  confidenceScore Float   @map("confidence_score")
  translationText String   @map("translation_text")
  context         Json?    // environmental context (time, location, activity)
  feedbackRating  Int?     @map("feedback_rating") // user validation 1-5
  createdAt       DateTime @default(now()) @map("created_at")
  
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  
  @@index([petId, createdAt])
  @@map("translations")
}

model SignalPattern {
  id              String   @id @default(uuid())
  patternType     String   @map("pattern_type") // bark, meow, purr, etc.
  acousticFeatures Json   @map("acoustic_features") // MFCCs, pitch, formants
  emotionMapping  String   @map("emotion_mapping")
  confidence      Float
  occurrenceCount Int      @default(1) @map("occurrence_count")
  verified        Boolean  @default(false)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  @@index([patternType, emotionMapping])
  @@map("signal_patterns")
}

model TrainingSession {
  id              String   @id @default(uuid())
  petId           String   @map("pet_id")
  sessionType     String   @map("session_type") // feedback, calibration, augmentation
  samplesCount    Int      @map("samples_count")
  accuracyDelta   Float?   @map("accuracy_delta")
  modelVersionId  String?  @map("model_version_id")
  status          String   // pending, processing, completed, failed
  metadata        Json?
  startedAt       DateTime @default(now()) @map("started_at")
  completedAt     DateTime? @map("completed_at")
  
  pet             Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  modelVersion    ModelVersion? @relation(fields: [modelVersionId], references: [id])
  
  @@map("training_sessions")
}

model ModelVersion {
  id              String   @id @default(uuid())
  version         String   @unique
  architecture    String
  accuracy        Float
  f1Score         Float    @map("f1_score")
  parameters      Json?    // model hyperparameters
  trainingDataSize Int     @map("training_data_size")
  deploymentStatus String   @map("deployment_status") // staging, production, archived
  createdAt       DateTime @default(now()) @map("created_at")
  
  trainingSessions TrainingSession[]
  
  @@map("model_versions")
}

model ApiKey {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  keyHash     String   @unique @map("key_hash")
  name        String
  permissions Json     // array of allowed endpoints
  rateLimit   Int      @default(1000) @map("rate_limit")
  lastUsedAt  DateTime? @map("last_used_at")
  expiresAt   DateTime? @map("expires_at")
  createdAt   DateTime @default(now()) @map("created_at")
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("api_keys")
}
```

---

## 2. Entity Relationships Diagram Description

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     User        │1     *│      Pet        │1     *│  Translation    │
├─────────────────┤───────┼─────────────────┤───────┼─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email           │       │ owner_id (FK)   │       │ pet_id (FK)     │
│ username        │       │ name            │       │ audio_url       │
│ password_hash   │       │ species         │       │ predicted_emotion│
│ profile_image   │       │ voice_profile   │       │ confidence_score│
│ is_active       │       │ created_at      │       │ translation_text│
└────────┬────────┘       └────────┬────────┘       └─────────────────┘
         │                         │
         │                         │1
         │                         │
         │1                        │*
┌────────▼────────┐       ┌────────▼────────┐       ┌─────────────────┐
│    ApiKey       │       │ TrainingSession │*─────1│  ModelVersion   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ pet_id (FK)     │       │ version         │
│ key_hash        │       │ model_version_id│       │ accuracy        │
│ permissions     │       │ session_type    │       │ f1_score        │
│ rate_limit      │       │ status          │       │ deployment_status│
└─────────────────┘       └─────────────────┘       └─────────────────┘

┌─────────────────┐
│  SignalPattern  │
├─────────────────┤
│ id (PK)         │
│ pattern_type    │
│ acoustic_features│
│ emotion_mapping │
│ verified        │
└─────────────────┘
```

**Relationship Summary:**

- **User → Pet**: One-to-many (a user can have multiple pets)
- **User → ApiKey**: One-to-many (a user can have multiple API keys)
- **Pet → Translation**: One-to-many (a pet generates many translations over time)
- **Pet → TrainingSession**: One-to-many (multiple training sessions per pet)
- **ModelVersion → TrainingSession**: One-to-many (sessions reference resulting models)
- **SignalPattern**: Independent lookup table for ML model training

---

## 3. REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create new account |
| POST | `/api/v1/auth/login` | Authenticate and receive JWT |
| POST | `/api/v1/auth/logout` | Invalidate token |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/forgot-password` | Request password reset |

### Pet Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/pets` | List user's pets |
| POST | `/api/v1/pets` | Register new pet |
| GET | `/api/v1/pets/:id` | Get pet details |
| PUT | `/api/v1/pets/:id` | Update pet information |
| DELETE | `/api/v1/pets/:id` | Remove pet and data |
| GET | `/api/v1/pets/:id/stats` | Get vocalization statistics |

### Translation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/translations` | Submit audio for translation |
| GET | `/api/v1/translations` | List translation history |
| GET | `/api/v1/translations/:id` | Get specific translation |
| POST | `/api/v1/translations/:id/feedback` | Submit user feedback |
| POST | `/api/v1/translations/stream` | Initiate WebSocket stream |

### Training

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/training/sessions` | Create training session |
| GET | `/api/v1/training/sessions` | List training sessions |
| GET | `/api/v1/training/sessions/:id` | Get session status |
| POST | `/api/v1/training/sessions/:id/cancel` | Cancel active session |
| GET | `/api/v1/training/models` | List available models |

---

## 4. WebSocket Protocol for Real-Time Audio Streaming

### Connection

```
wss://api.pettranslator.com/v1/stream?token=<jwt>&pet_id=<uuid>
```

### Message Protocol

**Client → Server: Audio Chunk**
```json
{
  "type": "audio_chunk",
  "seq": 1,
  "timestamp": 1709270400000,
  "encoding": "opus",
  "sample_rate": 16000,
  "data": "base64_encoded_opus_frame..."
}
```

**Server → Client: Transcription Update**
```json
{
  "type": "partial_result",
  "timestamp": 1709270400100,
  "interim": true,
  "emotion": {
    "label": "excited",
    "confidence": 0.87
  },
  "translation": "Want to play! Want to play!"
}
```

**Server → Client: Final Translation**
```json
{
  "type": "final_result",
  "timestamp": 1709270401500,
  "session_id": "uuid",
  "emotion": {
    "label": "excited",
    "confidence": 0.92,
    "breakdown": {
      "pitch_variance": 0.85,
      "energy_level": 0.95,
      "rhythm_pattern": 0.88
    }
  },
  "translation": "Let's play fetch! I'm so excited!",
  "context_hints": ["play_request", "high_energy"]
}
```

**Server → Client: Error**
```json
{
  "type": "error",
  "code": "AUDIO_QUALITY_LOW",
  "message": "Insufficient audio quality for analysis"
}
```

### Stream Lifecycle

1. **Initiation**: Client establishes WebSocket with authentication
2. **Streaming**: Client sends audio chunks at 100-200ms intervals
3. **Processing**: Server responds with partial results in real-time
4. **Finalization**: Client sends `stop_stream` message
5. **Completion**: Server sends `final_result` and closes gracefully

---

## 5. Request/Response Examples

### Register User

**Request:**
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "alice@example.com",
  "username": "alicew",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "alice@example.com",
      "username": "alicew",
      "created_at": "2024-03-01T12:00:00Z"
    },
    "tokens": {
      "access": "eyJhbGciOiJSUzI1NiIs...",
      "refresh": "eyJhbGciOiJSUzI1NiIs...",
      "expires_in": 3600
    }
  }
}
```

### Create Pet

**Request:**
```json
POST /api/v1/pets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bella",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "female"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Bella",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "female",
    "created_at": "2024-03-01T12:30:00Z"
  }
}
```

### Submit Translation

**Request:**
```json
POST /api/v1/translations
Authorization: Bearer <token>
Content-Type: multipart/form-data

pet_id: 660e8400-e29b-41d4-a716-446655440001
audio: <binary audio file>
context: {"location": "park", "activity": "walking"}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "pet_id": "660e8400-e29b-41d4-a716-446655440001",
    "audio_url": "https://cdn.pettranslator.com/audio/770e8400...",
    "duration_ms": 3250,
    "predicted_emotion": "happy",
    "confidence_score": 0.91,
    "translation_text": "I see a squirrel! Can I chase it?",
    "created_at": "2024-03-01T12:35:00Z"
  }
}
```

---

## 6. Rate Limiting and Caching Strategy

### Rate Limiting

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Authentication | 10 requests | 15 minutes |
| Translation (REST) | 100 requests | 1 hour |
| Translation (WebSocket) | 60 minutes | 1 hour |
| Training Sessions | 5 requests | 24 hours |
| General API | 1000 requests | 1 hour |

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1709274000
```

**Implementation:** Redis-backed token bucket algorithm per user/API key.

### Caching Strategy

| Data Type | Cache Layer | TTL | Key Pattern |
|-----------|-------------|-----|-------------|
| User Session | Redis | 1 hour | `session:{token}` |
| Pet Profile | Redis | 5 minutes | `pet:{id}:profile` |
| Translation History | CDN/Edge | 1 minute | `translations:{pet_id}:{page}` |
| Model Metadata | Redis | 1 hour | `model:{version}:meta` |
| Signal Patterns | In-Memory | 24 hours | N/A (application cache) |
| Audio Assets | CDN | 7 days | `audio:{translation_id}` |

**Cache Invalidation:**
- Pet updates: Clear `pet:{id}:profile`
- New translation: Invalidate history cache for pet
- Model deployment: Broadcast cache clear to all instances

### Database Optimization

- **Read Replicas**: Route SELECT queries to replicas (70% load distribution)
- **Connection Pooling**: PgBouncer with 100 connection pool
- **Query Optimization**: Indexed columns on all foreign keys and timestamp fields
- **Partitioning**: Translation table partitioned by `created_at` (monthly)

---

*Document Version: 1.0*
*Last Updated: 2024-03-01*
