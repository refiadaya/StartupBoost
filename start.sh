#!/bin/bash

echo "🚀 Starting StartupBoost Services..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. Python service will not be available."
    echo "📦 Starting Node.js service only..."
    npm start
    exit 0
fi

# Check if Python dependencies are installed
if [ ! -d "python-service/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    cd python-service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Start Python service in background
echo "🐍 Starting Python Analysis Service on port 5000..."
cd python-service
source venv/bin/activate
python app.py &
PYTHON_PID=$!
cd ..

# Wait for Python service to start
sleep 2

# Start Node.js service
echo "📦 Starting Node.js Server on port 3000..."
npm start &
NODE_PID=$!

echo ""
echo "✅ All services running!"
echo "   - Node.js API: http://localhost:3000"
echo "   - Python Analysis: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle Ctrl+C to kill both processes
trap "kill $PYTHON_PID $NODE_PID; exit" INT

# Wait for both processes
wait
