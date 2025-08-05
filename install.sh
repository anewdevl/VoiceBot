#!/bin/bash

echo "========================================"
echo "   VoiceBot One-Click Installer"
echo "========================================"
echo

# Check if Node.js is installed
echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Download the LTS version and run this installer again."
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Node.js is installed! (Version: $(node --version))"
echo

# Check if npm is installed
echo "Checking if npm is installed..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo
    echo "Please install npm and run this installer again."
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ npm is installed! (Version: $(npm --version))"
echo

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo

echo "========================================"
echo "   Setup Complete! 🎉"
echo "========================================"
echo
echo "To start your VoiceBot:"
echo "1. Add your Gemini API keys to a .env file"
echo "2. Run: npm start"
echo "3. Visit: http://localhost:3000"
echo
echo "For deployment instructions, see README.md"
echo
read -p "Press Enter to exit..." 