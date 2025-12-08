#!/bin/bash
# Complete setup script for local testing before AWS deployment

set -e

echo "🔧 StartupBoost Local Setup & Testing"
echo "====================================="

# Check prerequisites
echo "Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker $(docker --version)"

# Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose $(docker-compose --version)"

echo ""
echo "📦 Installing Node.js dependencies..."
npm install

echo ""
echo "🔑 Checking environment variables..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp aws/.env.example .env
    echo "❗ Please edit .env and add your GEMINI_API_KEY"
    echo ""
    read -p "Press Enter after you've added your API key to .env..."
fi

# Source .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY not set in .env"
    exit 1
fi
echo "✅ Environment variables configured"

echo ""
echo "🐳 Building Docker containers..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Test health endpoints
echo ""
echo "🧪 Testing health endpoints..."

# Test Node.js service
if curl -f http://localhost:3000/health &> /dev/null; then
    echo "✅ Node.js service is healthy"
else
    echo "❌ Node.js service is not responding"
    echo "Logs:"
    docker-compose logs nodejs-app
    exit 1
fi

# Test Python service
if curl -f http://localhost:5000/health &> /dev/null; then
    echo "✅ Python service is healthy"
else
    echo "❌ Python service is not responding"
    echo "Logs:"
    docker-compose logs python-service
    exit 1
fi

echo ""
echo "🎉 Setup complete! Services are running."
echo ""
echo "📊 Service URLs:"
echo "   Main App:      http://localhost:3000"
echo "   Python API:    http://localhost:5000"
echo "   Health Check:  http://localhost:3000/health"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"
echo ""
echo "🧪 Run a test analysis:"
echo "   curl -X POST http://localhost:3000/api/analyze \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"url\": \"https://stripe.com\"}'"
