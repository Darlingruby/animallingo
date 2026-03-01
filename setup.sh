#!/bin/bash
# Quick Setup Script for Pet Translator App
# Run this after extracting the zip file

echo "🐾 Pet Translator - Quick Setup"
echo "================================"

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20 LTS from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11+ from https://python.org"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "✅ Python version: $PYTHON_VERSION"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You'll need to:"
    echo "   - macOS: brew install postgresql@15"
    echo "   - Windows: Download from postgresql.org"
    echo "   - Or use Docker: docker run -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pet_translator -p 5432:5432 postgres:15"
    echo ""
    read -p "Continue without PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend install failed"
    exit 1
fi

# Set up environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please edit it with your database credentials."
fi

echo ""
echo "🗄️  Setting up Database..."
npx prisma generate
if command -v psql &> /dev/null; then
    # Try to create database
    createdb pet_translator 2>/dev/null || echo "Database may already exist"
    npx prisma migrate dev --name init
fi

cd ..

echo ""
echo "🤖 Setting up ML Service..."
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ ML service install failed"
    exit 1
fi
cd ..

echo ""
echo "📱 Setting up Mobile App..."
cd mobile
npm install
if [ $? -ne 0 ]; then
    echo "❌ Mobile install failed"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database URL"
echo "2. Start PostgreSQL (if not using Docker)"
echo "3. Run: ./start-all.sh"
echo ""
echo "Or start services individually:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd ml-service && source venv/bin/activate && uvicorn src.main:app --reload"
echo "  Terminal 3: cd mobile && npx react-native start"
echo "  Terminal 4: cd mobile && npx react-native run-ios (or run-android)"
