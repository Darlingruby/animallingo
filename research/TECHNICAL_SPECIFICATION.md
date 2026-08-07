# Technical Specification: Section 1 - System Architecture & Infrastructure

## 1. Executive Summary

This document outlines the comprehensive system architecture and infrastructure design for a modern, scalable mobile application platform. The architecture employs a microservices-based approach designed to support high availability, fault tolerance, and horizontal scalability. The system consists of a React Native mobile application serving as the primary user interface, a Node.js/Fastify backend API handling business logic and request orchestration, and specialized Python/FastAPI microservices for machine learning workloads. Data persistence is managed through PostgreSQL for transactional data and Redis for caching and session management. An API Gateway serves as the central entry point, handling routing, authentication, and rate limiting.

The infrastructure is designed to leverage cloud-native technologies with containerization via Docker and orchestration through Kubernetes. This design enables the platform to handle varying loads efficiently while maintaining consistent performance. Security is implemented at multiple layers, including JWT-based authentication, OAuth2 integration for third-party services, and comprehensive data encryption. The architecture supports multi-region deployment strategies to minimize latency and maximize availability for global user bases. This specification provides the foundation for development teams to implement, deploy, and maintain a robust, enterprise-grade application ecosystem.

---

## 2. High-Level Architecture Overview

### 2.1 Architecture Diagram Description

The system follows a layered microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  React Native   │  │  React Native   │  │     Web App     │              │
│  │   iOS Client    │  │ Android Client  │  │  (Future)       │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GATEWAY LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      API Gateway (Kong/AWS API GW)                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │    │
│  │  │   Routing   │  │ Rate Limit  │  │    Auth     │  │   Logging   │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│   API LAYER       │  │   ML SERVICES     │  │   SUPPORTING      │
│  ┌─────────────┐  │  │  ┌─────────────┐  │  │   SERVICES        │
│  │ Node.js/    │  │  │  │  Python/    │  │  │  ┌─────────────┐  │
│  │  Fastify    │  │  │  │  FastAPI    │  │  │  │  Message    │  │
│  │  Backend    │◄─┼──┼──┤   ML APIs   │  │  │  │   Queue     │  │
│  │             │  │  │  │             │  │  │  │  (RabbitMQ) │  │
│  │ - REST API  │  │  │  │ - Inference │  │  │  └─────────────┘  │
│  │ - WebSocket │  │  │  │ - Training  │  │  │  ┌─────────────┐  │
│  │ - GraphQL   │  │  │  │ - Model Mgmt│  │  │  │  Scheduler  │  │
│  └──────┬──────┘  │  │  └──────┬──────┘  │  │  │  (Bull)     │  │
│         │         │  │         │         │  │  └─────────────┘  │
└─────────┼─────────┘  └─────────┼─────────┘  └───────────────────┘
          │                      │
          ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   PostgreSQL    │  │     Redis       │  │   Object Store  │              │
│  │   (Primary DB)  │  │    (Cache)      │  │    (S3/MinIO)   │              │
│  │                 │  │                 │  │                 │              │
│  │ - User Data     │  │ - Sessions      │  │ - Media Files   │              │
│  │ - Transactions  │  │ - Cache Layer   │  │ - Backups       │              │
│  │ - Audit Logs    │  │ - Rate Limiting │  │ - ML Models     │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Descriptions

#### 2.2.1 Mobile Application (React Native)
- **Platform**: Cross-platform iOS and Android application
- **State Management**: Redux Toolkit with RTK Query for API interactions
- **Offline Support**: Local SQLite database with synchronization
- **Push Notifications**: Firebase Cloud Messaging integration
- **Deep Linking**: Universal links for seamless user experience

#### 2.2.2 API Gateway
- **Technology**: Kong or AWS API Gateway
- **Responsibilities**:
  - Request routing and load balancing
  - Authentication verification (JWT validation)
  - Rate limiting and throttling
  - SSL termination
  - Request/response transformation
  - API versioning

#### 2.2.3 Backend API (Node.js/Fastify)
- **Framework**: Fastify for high-performance HTTP handling
- **Architecture**: Domain-driven design with clear service boundaries
- **Key Features**:
  - RESTful API endpoints
  - WebSocket support for real-time features
  - GraphQL gateway for flexible data queries
  - Event-driven architecture with event emitters

#### 2.2.4 ML Microservices (Python/FastAPI)
- **Framework**: FastAPI for asynchronous ML inference endpoints
- **Capabilities**:
  - Real-time inference APIs
  - Batch processing pipelines
  - Model versioning and A/B testing
  - Feature store integration

#### 2.2.5 Data Stores
- **PostgreSQL**: Primary relational database for ACID transactions
- **Redis**: In-memory cache for session management and hot data
- **Object Storage**: S3-compatible storage for media and model artifacts

---

## 3. Component Interactions and Data Flow

### 3.1 Standard Request Flow

```
User Request → API Gateway → Auth Validation → Backend API → Database/Cache
                                              ↓
                                         ML Services (when needed)
                                              ↓
                                        Response ← Gateway ← User
```

### 3.2 Detailed Data Flow Scenarios

#### 3.2.1 User Authentication Flow
1. **Client** submits credentials to `/auth/login` endpoint
2. **API Gateway** validates request format and rate limits
3. **Backend API** queries PostgreSQL for user credentials
4. **Backend API** generates JWT access and refresh tokens
5. **Redis** stores session metadata with TTL
6. **Response** returns tokens to client for subsequent requests

#### 3.2.2 ML Inference Flow
1. **Client** sends inference request with input data
2. **API Gateway** authenticates JWT and forwards request
3. **Backend API** validates business rules and permissions
4. **Backend API** calls appropriate ML microservice via internal gRPC/HTTP
5. **ML Service** loads model from Object Storage (cached locally)
6. **ML Service** performs inference and returns results
7. **Backend API** transforms and enriches response
8. **Response** returned to client with prediction results

#### 3.2.3 Real-time Notification Flow
1. **Backend Event** triggers notification requirement
2. **Message Queue** (RabbitMQ/Bull) receives notification job
3. **Worker Service** processes queue and determines recipients
4. **Firebase FCM** sends push notification to target devices
5. **Client** receives and displays notification

#### 3.2.4 Data Synchronization Flow
1. **Mobile Client** detects network availability
2. **Client** sends sync request with local changes
3. **Backend API** validates and applies changes transactionally
4. **Backend API** queries for server-side updates
5. **Conflict Resolution** strategy applied if needed
6. **Client** applies server changes to local database

### 3.3 Inter-Service Communication

| Communication Type | Protocol | Use Case |
|-------------------|----------|----------|
| Synchronous | HTTP/REST | CRUD operations, immediate responses |
| Synchronous | gRPC | Internal service-to-service, high-performance |
| Asynchronous | Message Queue | Background jobs, notifications, event propagation |
| Real-time | WebSocket | Live updates, chat, collaborative features |

---

## 4. Deployment Strategy

### 4.1 Cloud Infrastructure

#### 4.1.1 Primary Provider: AWS
- **Compute**: Amazon EKS (Elastic Kubernetes Service)
- **Database**: Amazon RDS for PostgreSQL with Multi-AZ
- **Cache**: Amazon ElastiCache for Redis
- **Storage**: Amazon S3 for object storage
- **CDN**: CloudFront for static asset delivery
- **DNS**: Route 53 for domain management

#### 4.1.2 Alternative/Multi-Cloud
- **GCP**: GKE for Kubernetes, Cloud SQL for PostgreSQL
- **Azure**: AKS for Kubernetes, Azure Database for PostgreSQL

### 4.2 Containerization Strategy

```dockerfile
# Multi-stage build for optimized production images
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 4.3 Kubernetes Deployment

- **Namespace Strategy**: Separate namespaces per environment (dev, staging, prod)
- **Pod Distribution**: Multi-AZ deployment for high availability
- **Resource Management**: HPA (Horizontal Pod Autoscaler) for automatic scaling
- **Service Mesh**: Istio or Linkerd for advanced traffic management

### 4.4 CI/CD Pipeline

```
Code Commit → Build → Test → Security Scan → Container Build → Push to Registry
                                                        ↓
                                            Deploy to Staging → Integration Tests
                                                        ↓
                                            Deploy to Production (Canary/Blue-Green)
```

### 4.5 Infrastructure as Code

- **Terraform**: Cloud resource provisioning
- **Helm**: Kubernetes application deployment
- **Ansible**: Configuration management where needed

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

#### 5.1.1 JWT Token Strategy
- **Access Tokens**: Short-lived (15 minutes), signed with RS256
- **Refresh Tokens**: Long-lived (7 days), stored securely in httpOnly cookies
- **Token Claims**: User ID, roles, permissions, expiration
- **Rotation**: Refresh tokens rotated on each use with reuse detection

#### 5.1.2 OAuth2 Integration
- **Providers**: Google, Apple, Facebook for social login
- **Flow**: Authorization Code with PKCE for mobile apps
- **Token Exchange**: OAuth tokens exchanged for internal JWTs

### 5.2 Data Protection

#### 5.2.1 Encryption at Rest
- **Database**: PostgreSQL with AES-256 encryption
- **Sensitive Fields**: Application-level encryption for PII
- **Backups**: Encrypted backup storage with separate key management

#### 5.2.2 Encryption in Transit
- **TLS 1.3**: Required for all API communications
- **Certificate Management**: Let's Encrypt with automatic renewal
- **Internal Services**: mTLS for service-to-service communication

### 5.3 Security Layers

| Layer | Security Measure |
|-------|-----------------|
| Network | VPC isolation, security groups, WAF rules |
| Application | Input validation, parameterized queries, CSRF protection |
| Authentication | MFA support, brute force protection, session management |
| Data | Encryption, anonymization, audit logging |
| Infrastructure | Container scanning, dependency checks, secrets management |

### 5.4 Secrets Management

- **Solution**: HashiCorp Vault or AWS Secrets Manager
- **Practices**:
  - No hardcoded secrets in repositories
  - Automatic secret rotation
  - Audit logging for secret access
  - Least-privilege access policies

---

## 6. Scalability Considerations

### 6.1 Horizontal Scaling

#### 6.1.1 Stateless Services
- Backend API and ML services designed to be stateless
- Session data externalized to Redis
- Any service instance can handle any request

#### 6.1.2 Auto-Scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 6.2 Database Scalability

#### 6.2.1 Read Scaling
- **Read Replicas**: Multiple PostgreSQL read replicas for query distribution
- **Connection Pooling**: PgBouncer for efficient connection management
- **Caching Strategy**: Redis for frequently accessed data

#### 6.2.2 Write Scaling
- **Sharding Strategy**: Horizontal partitioning for high-volume tables
- **Partitioning**: Time-based partitioning for audit and log tables
- **Async Processing**: Queue-based write deferral for non-critical operations

### 6.3 Performance Optimization

#### 6.3.1 Caching Strategy
- **L1 Cache**: In-memory application cache (hot data)
- **L2 Cache**: Redis distributed cache (session, frequent queries)
- **L3 Cache**: CDN for static assets and API responses where appropriate

#### 6.3.2 Database Optimization
- **Indexing**: Strategic indexes on query patterns
- **Query Optimization**: Query plan analysis and optimization
- **Materialized Views**: For complex, frequently-run aggregations

### 6.4 Capacity Planning

| Metric | Current | 6-Month Target | 12-Month Target |
|--------|---------|----------------|-----------------|
| DAU | 10,000 | 50,000 | 200,000 |
| Peak RPS | 100 | 500 | 2,000 |
| Data Storage | 100 GB | 500 GB | 2 TB |
| ML Inferences/min | 1,000 | 10,000 | 50,000 |

### 6.5 Disaster Recovery

- **RPO (Recovery Point Objective)**: < 5 minutes
- **RTO (Recovery Time Objective)**: < 30 minutes
- **Multi-Region**: Active-passive deployment in secondary region
- **Backups**: Continuous point-in-time recovery for databases
- **Failover**: Automated DNS failover with health checks

---

## 7. Monitoring and Observability

### 7.1 Monitoring Stack
- **Metrics**: Prometheus + Grafana for system metrics
- **Logging**: ELK Stack or Loki for centralized logging
- **Tracing**: Jaeger or AWS X-Ray for distributed tracing
- **Alerting**: PagerDuty integration for critical alerts

### 7.2 Key SLIs/SLOs
- **Availability**: 99.95% uptime
- **Latency**: p95 < 200ms for API responses
- **Error Rate**: < 0.1% for 5xx errors
- **Throughput**: Support 10x expected peak load

---

*Document Version: 1.0*  
*Last Updated: March 2026*  
*Author: System Architecture Team*
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
# Technical Specification - Section 3: ML Pipeline & User Interface

## 3.1 ML Pipeline Architecture

The Universal Animal Translation System (UATS) employs a dual-mode machine learning architecture designed to balance real-time responsiveness with computational accuracy. This hybrid approach leverages edge computing for immediate translations while maintaining cloud-based capabilities for complex inference tasks.

### 3.1.1 On-Device Processing (TensorFlow Lite)

The primary inference pipeline runs on-device using **TensorFlow Lite 2.13+**, optimized for ARM64 and x86_64 mobile processors. This architecture prioritizes low latency and offline functionality.

| Component | Specification |
|-----------|---------------|
| Runtime | TensorFlow Lite with XNNPACK delegate |
| Quantization | INT8 post-training quantization |
| Model Format | `.tflite` flatbuffer |
| Supported Accelerators | GPU delegate (OpenCL/Vulkan), NNAPI, Core ML |
| Memory Footprint | < 180MB (all species models loaded) |
| Threading | 4 worker threads for inference |

The on-device pipeline handles 90% of translation requests without network connectivity, ensuring functionality in remote environments (wildlife research, rural pet ownership, marine applications).

### 3.1.2 Cloud Fallback (PyTorch)

When on-device confidence falls below 0.75, or for species requiring complex contextual analysis, the system falls back to cloud inference using **PyTorch 2.0+** on GPU-accelerated servers.

```
┌─────────────────────────────────────────────────────────────┐
│                    INFERENCE PIPELINE                        │
├─────────────────────────────────────────────────────────────┤
│  Audio Input → Preprocessing → On-Device (TFLite)          │
│                                    ↓                        │
│                            Confidence < 0.75?               │
│                            /           \                    │
│                         Yes            No                   │
│                          ↓              ↓                   │
│                    Cloud (PyTorch)  Return Result           │
│                          ↓                                  │
│                     Cache Result                            │
└─────────────────────────────────────────────────────────────┘
```

Cloud models utilize transformer-based architectures (BERT-style attention mechanisms) for contextual understanding of multi-utterance sequences and cross-species behavioral patterns.

---

## 3.2 Audio Processing Specifications

Consistent audio preprocessing ensures model input standardization across all supported species.

### 3.2.1 Recording Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Sample Rate | 16 kHz | Captures 0-8 kHz vocalization range |
| Bit Depth | 16-bit PCM | Sufficient dynamic range |
| Channels | Mono | Vocalizations are point-source |
| Window Duration | 4 seconds | Captures context + utterance |
| Hop Length | 1 second | 75% overlap for continuity |

### 3.2.2 Feature Extraction

Two parallel feature extraction pipelines feed into the model:

**Pipeline A: MFCC (Mel-Frequency Cepstral Coefficients)**
- 40 MFCC coefficients
- 512-point FFT window
- 128 Mel filter banks
- Output: 40 × 125 time-frequency representation

**Pipeline B: Mel-Spectrogram**
- 128 Mel bins
- 1024-point FFT window
- 50% overlap
- Log compression
- Output: 128 × 250 spectrogram

These features are concatenated into a 168-channel input tensor (40 MFCC + 128 Mel) with temporal resolution of 125 frames per 4-second window.

---

## 3.3 Model Architecture

The UATS employs a **CNN-LSTM hybrid architecture** optimized for sequential audio classification with temporal dependency modeling.

### 3.3.1 Architecture Layers

```
Input (168 × 125 × 1)
    ↓
Conv2D (64 filters, 3×3) → BatchNorm → ReLU → MaxPool
    ↓
Conv2D (128 filters, 3×3) → BatchNorm → ReLU → MaxPool
    ↓
Conv2D (256 filters, 3×3) → BatchNorm → ReLU → GlobalAvgPool
    ↓
Reshape for LSTM
    ↓
Bidirectional LSTM (256 units)
    ↓
Bidirectional LSTM (128 units)
    ↓
Dense (512) → Dropout(0.3) → ReLU
    ↓
Dense (NumClasses) → Softmax
```

### 3.3.2 Quantization Strategy

To maintain the <150MB model size requirement:

| Component | Precision | Size Reduction |
|-----------|-----------|----------------|
| Conv layers | INT8 | 4× reduction |
| LSTM weights | INT8 | 4× reduction |
| LSTM activations | FP16 | 2× reduction |
| Embedding layers | INT8 | 4× reduction |

**Post-Training Quantization Pipeline:**
1. Representative dataset calibration (1000 samples per species)
2. Per-channel quantization for weights
3. Per-tensor quantization for activations
4. Dynamic range adjustment for LSTM gates

Final model sizes per species: 12-35 MB (varies by vocabulary complexity).

---

## 3.4 Species-Specific Classifiers

Each species requires specialized model adaptations to handle unique vocalization characteristics.

### 3.4.1 Canine (Dog) Bark Classifier

- **Vocabulary Size:** 47 distinct utterance types
- **Model Additions:** Harmonic analysis layer for pitch tracking
- **Special Features:** Bark duration analysis, growl sub-harmonic detection
- **Output Categories:** Play, warning, fear, hunger, greeting, alert, distress, etc.

### 3.4.2 Feline (Cat) Meow Classifier

- **Vocabulary Size:** 38 distinct utterance types
- **Model Additions:** Purr fundamental frequency tracker
- **Special Features:** Trill detection, chirp classification, hiss spectral analysis
- **Output Categories:** Demand, greeting, complaint, hunting frustration, contentment

### 3.4.3 Avian (Bird) ABC-D Grammar Model

Bird vocalizations require syntactic parsing due to learned song structures:

- **Vocabulary Size:** 150+ syllable types per species
- **Architecture Extension:** Attention-based sequence-to-sequence decoder
- **Grammar Model:** Probabilistic context-free grammar for syllable ordering
- **Output:** Phrase meaning + emotional valence + territorial marking status

### 3.4.4 Cetacean (Dolphin) Whistle Classifier

- **Vocabulary Size:** ~30 distinct whistle contours
- **Model Additions:** Continuous wavelet transform for FM sweep analysis
- **Special Features:** Click train detection, burst pulse classification
- **Output Categories:** Individual ID, group coordination, prey location, social bonding

### 3.4.5 Model Loading Strategy

```python
# Lazy-loading architecture for memory efficiency
species_model_registry = {
    "canis_lupus_familiaris": load_on_demand("dog_classifier.tflite"),
    "felis_catus": load_on_demand("cat_classifier.tflite"),
    "passer_domesticus": load_on_demand("sparrow_grammar.tflite"),
    "tursiops_truncatus": load_on_demand("dolphin_whistle.tflite"),
    # ... additional species
}
```

---

## 3.5 User Interface Design

The UATS mobile application provides five primary interaction modes.

### 3.5.1 Screen 1: Home / Translation Hub

```
┌─────────────────────────────────────┐
│ ≡  Universal Translator      ⚙️ 🔋  │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │    [WAVE VISUALIZER]    │      │
│    │    ~~~∿∿∿∿∿∿∿∿∿∿∿~~~    │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
│    "Listening... (Dog detected)"    │
│                                     │
│    ┌─────────────────────────┐      │
│    │  🐕 "I need to go out"  │      │
│    │     Confidence: 94%     │      │
│    └─────────────────────────┘      │
│                                     │
│  ┌──────────┐ ┌──────────┐          │
│  │ 🎙️ Reply │ │ 📷 Camera│          │
│  └──────────┘ └──────────┘          │
│                                     │
└─────────────────────────────────────┘
         [🏠]  [🎙️]  [📹]  [⚙️]
```

### 3.5.2 Screen 2: Human-to-Pet Communication

```
┌─────────────────────────────────────┐
│ ← Human to Pet                     │
├─────────────────────────────────────┤
│  Speak to your [Dog]:               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ "Come here for dinner"      │    │
│  └─────────────────────────────┘    │
│                                     │
│  Translation Preview:               │
│  ┌─────────────────────────────┐    │
│  │ [🎵 WHISTLE + CLICK]        │    │
│  │ Tone: Friendly, Urgent      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     🔊 PLAY PREVIEW         │    │
│  └─────────────────────────────┘    │
│                                     │
│  Quick Phrases:                     │
│  [Sit] [Stay] [Come] [No] [Treat]   │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.3 Screen 3: Reptile Vibration Mode

```
┌─────────────────────────────────────┐
│ ← Reptile Communication            │
├─────────────────────────────────────┤
│  ⚠️ External vibration sensor req.  │
│                                     │
│  Status: 🔌 Sensor Connected        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [VIBRATION VISUALIZER]     │    │
│  │     ═══╦═══╦══════╦════     │    │
│  │     Low│Med │High  │Pat     │    │
│  └─────────────────────────────┘    │
│                                     │
│  Detected Pattern:                  │
│  "Territorial display - Male"       │
│  Species: Tarantula (B. hamorii)    │
│                                     │
│  [View Pattern Library]             │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.4 Screen 4: Training Mode

```
┌─────────────────────────────────────┐
│ ← Training & Calibration           │
├─────────────────────────────────────┤
│  Active Training: Dog (Max)         │
│  Progress: ████████████░░  78%      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Record sample utterance    │    │
│  │                             │    │
│  │     [🔴 RECORDING 00:03]    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Context: ☐ Play  ☑ Hunger  ☐ Fear  │
│                                     │
│  Label this recording:              │
│  ┌─────────────────────────────┐    │
│  │ "Requesting food"           │    │
│  └─────────────────────────────┘    │
│                                     │
│     [Submit]  [Skip]  [Discard]     │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.5 Screen 5: Camera Analysis

```
┌─────────────────────────────────────┐
│ ← Visual Behavior Analysis         │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [CAMERA PREVIEW]         │    │
│  │         🐕                  │    │
│  │    [Tail: Wagging]          │    │
│  │    [Ears: Forward]          │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Visual Cues Detected:              │
│  • Tail position: Up/Right          │
│  • Ear orientation: Alert           │
│  • Mouth: Relaxed (not panting)     │
│                                     │
│  Combined with Audio:               │
│  "Friendly greeting, seeking play"  │
│  Confidence: 91%                    │
│                                     │
│  [Capture]  [Switch Camera]         │
└─────────────────────────────────────┘
```

---

## 3.6 Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| End-to-end Latency | < 500ms | Audio input → Displayed translation |
| On-device Inference | < 200ms | TFLite model execution time |
| Cloud Fallback Latency | < 800ms | Including network round-trip |
| Model Load Time | < 2s | Cold start to ready state |
| Battery Impact | < 5%/hour | Continuous monitoring mode |
| Accuracy (Top-1) | > 85% | Validated on held-out test set |
| Accuracy (Top-3) | > 95% | Including context disambiguation |

---

## 3.7 Hardware Limitations

The following biological communication channels are **not supported** in the current hardware revision:

### 3.7.1 Chemical Signaling (Pheromones)

Pheromone-based communication in mammals, insects, and reptiles cannot be detected or synthesized. The system does not include:
- Volatile organic compound (VOC) sensors
- Pheromone synthesis hardware
- Olfactory emission modules

**Workaround:** Visual and auditory cues that often accompany pheromone signaling are analyzed.

### 3.7.2 Substrate-Borne Vibrations

Spider and scorpion seismic communication requires specialized hardware:

| Species Group | Communication Method | Required Hardware |
|---------------|---------------------|-------------------|
| Theraphosidae (Tarantulas) | Leg-tapping vibrations | Piezoelectric sensor mat |
| Scorpiones | Stridulation + substrate vibration | Accelerometer array |
| Certain insects | Plant-stem vibrations | Contact microphone |

**Implementation:** Optional external sensor accessory (sold separately) connects via Bluetooth Low Energy. The app provides vibration pattern analysis when sensor is connected.

### 3.7.3 Ultrasonic Frequencies

Frequencies above 22 kHz (used by bats, some rodents) require specialized microphones not present in standard smartphone hardware.

---

## 3.8 Summary

The ML pipeline architecture balances on-device performance with cloud intelligence, utilizing TensorFlow Lite for 90% of inference tasks while maintaining PyTorch fallback for complex analysis. The CNN-LSTM architecture with INT8 quantization achieves sub-500ms latency targets while remaining under 150MB storage constraints. Species-specific classifiers handle unique vocalization characteristics from dog barks to dolphin whistles, while the five-screen UI provides intuitive access to translation, training, and specialized modes for non-audio communication channels.

---

*Document Version: 1.0*
*Last Updated: 2026-03-01*
*Word Count: ~1,450*
---

# Document Information

- **Total Sections:** 3
- **Total Word Count:** ~4,500 words
- **Created:** March 1, 2026
- **Project:** Bidirectional Pet Communication Translation App
