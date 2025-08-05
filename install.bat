@echo off
echo ========================================
echo    VoiceBot One-Click Installer
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run this installer again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed!
echo.

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo To start your VoiceBot:
echo 1. Add your Gemini API keys to a .env file
echo 2. Run: npm start
echo 3. Visit: http://localhost:3000
echo.
echo For deployment instructions, see README.md
echo.
pause 