# AnimalLingo - Project Structure

## Overview
Bidirectional animal communication translation app for iOS and Android.

## Repository Structure

```
animallingo/
├── mobile/                 # React Native 0.73+ application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── store/          # Redux Toolkit state management
│   │   ├── services/       # API clients
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── constants/      # App constants
│   │   └── types/          # TypeScript types
│   ├── android/            # Android-specific config
│   ├── ios/                # iOS-specific config
│   └── __tests__/          # Test files
│
├── backend/                # Node.js/Fastify API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express/Fastify middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── prisma/             # Prisma schema and migrations
│   └── tests/              # API tests
│
├── ml-service/             # Python/FastAPI ML microservices
│   ├── src/
│   │   ├── models/         # ML model definitions
│   │   ├── inference/      # Inference endpoints
│   │   ├── training/       # Training pipelines
│   │   ├── audio/          # Audio processing
│   │   └── vision/         # Computer vision
│   └── models/             # Trained model weights
│
├── shared/                 # Shared types and utilities
│   ├── types/              # Shared TypeScript types
│   └── constants/          # Shared constants
│
└── docs/                   # Documentation
    ├── api/                # API documentation
    ├── deployment/         # Deployment guides
    └── store/              # App store assets

```

## Quick Start

### Prerequisites
- Node.js 20 LTS
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Development Setup
See individual README files in each directory.
