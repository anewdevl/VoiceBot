# 🧠 Personal Voice Bot with Gemini AI

A modern, user-friendly voice bot that responds to personal questions using Google's Gemini AI. Features speech-to-text, text-to-speech, and a beautiful web interface with a personalized AI persona.

## ✨ Features

- 🎤 **Voice Recognition**: Speak your questions naturally
- 🔊 **Text-to-Speech**: Hear responses spoken back to you
- 💬 **Text Input**: Type questions if you prefer
- 🎨 **Modern UI**: Beautiful, responsive design
- 🤖 **Gemini AI**: Powered by Google's advanced AI model
- 📱 **Mobile Friendly**: Works on all devices
- 🎯 **Personalized Responses**: AI trained on specific personality and background
- 🔄 **Dual API Keys**: Automatic fallback for reliability
- 🎵 **Voice Controls**: Adjustable speed, pitch, and voice selection

## 🛠️ Quick Start

### Option 1: One-Click Installation (Recommended)

#### For Windows Users:

1. **Install Node.js** from [https://nodejs.org/](https://nodejs.org/) (if not already installed)
2. **Double-click** `install.bat` to run the installer
3. Follow the on-screen instructions

#### For Mac/Linux Users:

1. **Install Node.js** (if not already installed)
2. **Run the installer**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

### Option 2: Manual Setup

#### 1. Get Your Gemini API Keys

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create two API keys for redundancy
3. Copy the keys for the next step

#### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
GEMINI_API_KEY1=your_first_gemini_api_key_here
GEMINI_API_KEY2=your_second_gemini_api_key_here
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to use your voice bot!

### 📖 Detailed Setup Guide

For comprehensive setup instructions and troubleshooting, see [SETUP.md](SETUP.md).

## 🛠️ Development

Run in development mode with auto-restart:

```bash
npm run dev
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts
4. Add your `GEMINI_API_KEY1` and `GEMINI_API_KEY2` in Vercel dashboard under Environment Variables

### Deploy to Other Platforms

The app can be deployed to:

- **Heroku**: Add `GEMINI_API_KEY1` and `GEMINI_API_KEY2` to config vars
- **Railway**: Add environment variables in dashboard
- **Render**: Set environment variables in service settings

## 🎯 Customization

### Personality Prompts

Edit the `SYSTEM_PROMPT` in `server.js` to customize how the bot responds:

```javascript
const SYSTEM_PROMPT = `You are [your name], [your background]. Respond casually like chatting with a friend, 2-3 sentences max.`
```

### Voice Settings

The voice bot includes adjustable settings:

- **Speed**: Control how fast the AI speaks (0.5 - 2.0)
- **Pitch**: Adjust the voice pitch (0.5 - 2.0)
- **Voice Selection**: Choose from available system voices

### Styling

Customize the appearance by editing `public/style.css`.

## 🌐 Browser Compatibility

- **Voice Recognition**: Chrome, Edge, Safari (recent versions)
- **Text-to-Speech**: All modern browsers
- **Text Input**: Universal support

## 🔧 Troubleshooting

### Voice Recognition Not Working

- Ensure you're using HTTPS (required for microphone access)
- Check browser permissions for microphone
- Use Chrome or Edge for best compatibility

### API Errors

- Verify your Gemini API keys are correct
- Check that your API keys have proper permissions
- Ensure you haven't exceeded API quotas
- The system will automatically try the second API key if the first one fails

## 🏗️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (`gemini-flash-lite-latest` by default; override with `GEMINI_MODEL` in `.env`)
- **Speech**: Web Speech API, Speech Synthesis API
- **Deployment**: Vercel (recommended)

## License

MIT License - feel free to use this for your projects!

## 📋 Project Structure

```
VoiceBot-main/
├── public/
│   ├── index.html      # Main UI
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── server.js           # Backend API
├── package.json        # Dependencies
├── vercel.json         # Deployment config
├── install.bat         # Windows installer
├── install.sh          # Unix/Linux/Mac installer
├── SETUP.md           # Detailed setup guide
└── README.md          # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Web Speech API for voice recognition and synthesis
- Vercel for seamless deployment

## Live demo

**[Open the deployed Voice Bot](https://voice-bot-main-2trfuh762-anewdevls-projects.vercel.app)** (HTTPS on Vercel).

The demo needs valid **`GEMINI_API_KEY1`** / **`GEMINI_API_KEY2`** on that Vercel project, active Google API access, and available quota. Voice input needs a browser that supports the Web Speech API (Chrome or Edge work well) and microphone permission.
