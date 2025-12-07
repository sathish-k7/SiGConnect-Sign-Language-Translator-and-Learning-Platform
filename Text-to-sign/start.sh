#!/bin/bash

# Text to ISL - Quick Start Script
# This script starts both the Flask backend and React frontend

echo "🚀 Starting Sign Language Translator..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please create one first:"
    echo "   python3 -m venv .venv"
    echo "   source .venv/bin/activate"
    echo "   pip install -r requirements.txt"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "\n🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "\n🔧 Setting up environment..."
export JAVA_HOME=$(/usr/libexec/java_home)

echo "\n🐍 Starting Flask backend on port 5001..."
cd ..
source .venv/bin/activate
python -u main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo "\n⚛️  Starting React frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "\n✅ Servers running!"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo "\nPress Ctrl+C to stop both servers"

# Wait for user to stop
wait
