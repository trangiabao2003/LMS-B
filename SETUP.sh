#!/bin/bash

# LMS-B AI System - Quick Setup for Mac/Linux

echo ""
echo "============================================"
echo "  LMS-B AI Chatbot - Setup Script"
echo "============================================"
echo ""

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python not found. Please install Python 3.9+"
    echo "Download: https://www.python.org/downloads/"
    exit 1
fi
echo "✓ Python found"

# Check Node
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js 18+"
    echo "Download: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found"

echo ""
echo "============================================"
echo "   Setting up Python AI Service"
echo "============================================"
echo ""

cd "$(dirname "$0")/python-ai"

# Create venv if not exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt -q

echo ""
echo "============================================"
echo "   Setting up Express Server"
echo "============================================"
echo ""

cd "$(dirname "$0")/server"

if [ ! -d "node_modules" ]; then
    echo "Installing Server dependencies..."
    npm install -q
fi

echo ""
echo "============================================"
echo "   Setting up React Client"
echo "============================================"
echo ""

cd "$(dirname "$0")/client"

if [ ! -d "node_modules" ]; then
    echo "Installing Client dependencies..."
    npm install -q
fi

echo ""
echo "============================================"
echo "   ✓ Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Open 6 terminals and run these commands:"
echo ""
echo "    Terminal 1 - Ollama:"
echo "    ollama serve"
echo ""
echo "    Terminal 2 - MongoDB:"
echo "    mongod"
echo ""
echo "    Terminal 3 - Redis:"
echo "    redis-server"
echo ""
echo "    Terminal 4 - Python AI Service:"
echo "    cd python-ai && source venv/bin/activate && python main.py"
echo ""
echo "    Terminal 5 - Express Server:"
echo "    cd server && npm run dev"
echo ""
echo "    Terminal 6 - React Client:"
echo "    cd client && npm run dev"
echo ""
echo "2. Open browser: http://localhost:3000"
echo "3. Login and test the AI chatbot!"
echo ""
echo "============================================"
echo ""
