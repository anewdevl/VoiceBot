# 🚀 VoiceBot Setup Guide

## One-Click Installation

### For Windows Users:

1. **Download Node.js** (if not already installed):

   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS version
   - Run the installer

2. **Run the installer**:
   - Double-click `install.bat`
   - Follow the on-screen instructions

### For Mac/Linux Users:

1. **Install Node.js** (if not already installed):

   - Mac: `brew install node` (requires Homebrew)
   - Linux: `sudo apt install nodejs npm` (Ubuntu/Debian)
   - Or download from [https://nodejs.org/](https://nodejs.org/)

2. **Run the installer**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

## Manual Setup (Alternative)

### Prerequisites:

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation Steps:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   - Create a `.env` file in the project root
   - Add your Gemini API keys:

   ```
   GEMINI_API_KEY1=your_first_api_key_here
   GEMINI_API_KEY2=your_second_api_key_here
   ```

3. **Start the application**:

   ```bash
   npm start
   ```

4. **Access your VoiceBot**:
   - Open your browser
   - Go to: `http://localhost:3000`

## Getting Gemini API Keys

1. **Visit Google AI Studio**:

   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Keys**:

   - Click "Create API Key"
   - Create two keys for redundancy
   - Copy both keys

3. **Add to your project**:
   - Create a `.env` file in the project folder
   - Add your keys as shown above

## Troubleshooting

### "Node.js is not installed"

- Download from [https://nodejs.org/](https://nodejs.org/)
- Install the LTS version
- Restart your computer
- Run the installer again

### "npm install failed"

- Check your internet connection
- Try running as administrator (Windows)
- Clear npm cache: `npm cache clean --force`

### "API keys not working"

- Verify your keys are correct
- Check that you haven't exceeded API quotas
- Ensure keys are in the `.env` file (not `.env.txt`)

### "Voice recognition not working"

- Use HTTPS in production
- Allow microphone permissions in browser
- Use Chrome or Edge for best compatibility

## Next Steps

After installation:

1. Add your API keys to `.env`
2. Run `npm start`
3. Visit `http://localhost:3000`
4. Start chatting with your VoiceBot!

For deployment to the web, see the main README.md file.
