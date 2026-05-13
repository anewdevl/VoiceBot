# Personal Voice Bot (Gemini)

Web app that answers questions with Google Gemini: speech-to-text, text input, text-to-speech, and a configurable system prompt in `server.js`.

## Features

- Voice input (Web Speech API)
- Text input
- Spoken replies (Speech Synthesis API)
- Responsive layout
- Two Gemini API keys with automatic fallback
- Adjustable speech rate, pitch, and voice

## Quick start

### Option 1: Install scripts

**Windows:** Install [Node.js](https://nodejs.org/), then run `install.bat` and follow the prompts.

**macOS / Linux:**

```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual setup

1. Create API keys in [Google AI Studio](https://makersuite.google.com/app/apikey) (two keys optional but recommended for fallback).

2. Add a `.env` file in the project root:

```bash
GEMINI_API_KEY1=your_first_key
GEMINI_API_KEY2=your_second_key
```

3. Install dependencies:

```bash
npm install
```

4. Run the server:

```bash
npm run dev   # nodemon
npm start     # production
```

Open `http://localhost:3000`.

More detail: [SETUP.md](SETUP.md).

## Development

```bash
npm run dev
```

## Deployment

**Vercel**

1. `npm i -g vercel` then `vercel --prod`, or connect the GitHub repo in the Vercel dashboard.
2. Set `GEMINI_API_KEY1` and `GEMINI_API_KEY2` under Project → Settings → Environment Variables.

**Other hosts:** Set the same variables in Heroku config vars, Railway, Render, or your provider’s env UI.

## Customization

- **Persona:** Edit `SYSTEM_PROMPT` in `server.js`.
- **Model:** Default is `gemini-flash-lite-latest`. Override with `GEMINI_MODEL` in `.env`.
- **Styling:** `public/style.css`.

## Browser notes

Speech recognition works best in recent Chrome or Edge; microphone access requires HTTPS in production.

## Troubleshooting

- **Mic / voice:** HTTPS, browser permissions, supported browser.
- **API errors:** Confirm keys, project billing/quota, and Generative Language API access. The server tries the second key if the first request fails.

## Tech stack

- HTML, CSS, JavaScript (`public/`)
- Node.js, Express (`server.js`)
- `@google/generative-ai`
- Web Speech API and Speech Synthesis API

## License

MIT

## Project layout

```
VoiceBot-main/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── vercel.json
├── install.bat
├── install.sh
├── SETUP.md
└── README.md
```

## Contributing

Fork the repository, create a branch, commit changes, push, and open a pull request.

## Acknowledgments

Google Gemini API; Web Speech API; hosting options including Vercel.

## Live demo

[Deployed app](https://voice-bot-main-2trfuh762-anewdevls-projects.vercel.app) (HTTPS).

The deployment must define `GEMINI_API_KEY1` and `GEMINI_API_KEY2` in Vercel, and the Google project must have API access and quota. Voice input needs a compatible browser and microphone permission.
