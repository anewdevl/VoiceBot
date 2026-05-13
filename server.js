const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const { GoogleGenerativeAI } = require("@google/generative-ai")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Vercel / reverse proxies: use X-Forwarded-For for rate-limit keys
app.set("trust proxy", 1)

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Initialize multiple Gemini instances
const gemini1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY1)
const gemini2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2)

const GEMINI_MODEL = "gemini-flash-lite-latest"

const chatRateLimit = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages from this address. Please try again in a few minutes.",
  },
})

// Optimized system prompt for Flash models
const SYSTEM_PROMPT = `You are Adil, a Computer Science graduate from Methodist College (CGPA: 8.73) working as a Programmer Analyst Trainee at Cognizant. You're passionate about problem-solving, debugging, and building innovative software solutions. Your superpower is obsessive error-solving - you sit until you find the issue. You're flexible like a jack of all trades. You want to grow in Machine Learning, teamwork, and communication. People might think you're judgmental based on appearance, but you're actually chill. You push boundaries by putting yourself where you're the least experienced. You have experience with Python, React, Flask, AWS, and various ML libraries. Respond semi-formally and keep it short (humanly, relevantly and try not to answer more than prompted) and a slight hint of casualness,SlightlyIndian style typed english), 2-3 sentences max, dont act like a coding assistant.`

// Retry function with exponential backoff
async function retryApiCall(apiCall, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message)
      if (i === maxRetries - 1) throw error
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      )
    }
  }
}

// Try Gemini API with prompt concatenation for Flash models
async function tryGemini(message, apiKey = 1) {
  try {
    const genAI = apiKey === 1 ? gemini1 : gemini2
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { temperature: 0.7, topP: 0.8, maxOutputTokens: 200 },
    })

    // Concatenate system prompt with user message for Flash models
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAdil:`
    const apiCall = () => model.generateContent(fullPrompt)
    const result = await retryApiCall(apiCall, 3, 2000)
    return result.response.text()
  } catch (error) {
    console.log(`❌ Gemini API ${apiKey} failed:`, error.message)
    throw error
  }
}

// Main chat endpoint with multiple Gemini API keys
app.post("/api/chat", chatRateLimit, async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    let response
    let usedProvider = ""

    // Try Gemini API Key 1 first
    try {
      console.log("🧠 Trying Gemini API Key 1...")
      response = await tryGemini(message, 1)
      usedProvider = "Gemini API 1"
      console.log("✅ Gemini API 1 succeeded!")
    } catch (gemini1Error) {
      console.log("⚠️ Gemini API 1 failed, trying Gemini API Key 2...")

      // Fallback to Gemini API Key 2
      try {
        response = await tryGemini(message, 2)
        usedProvider = "Gemini API 2"
        console.log("✅ Gemini API 2 succeeded!")
      } catch (gemini2Error) {
        console.log("❌ Both Gemini APIs failed")

        // Both failed - return nice error message
        return res.status(503).json({
          error:
            "I'm having some technical difficulties right now. Please try again in a moment! 🤖",
          details: {
            gemini1Error: gemini1Error.message,
            gemini2Error: gemini2Error.message,
            timestamp: new Date().toISOString(),
          },
        })
      }
    }

    console.log(`✅ Response generated using ${usedProvider}`)
    res.json({ response, provider: usedProvider })
  } catch (error) {
    console.error("❌ Unexpected error:", error)
    res.status(500).json({
      error: "Sorry, something unexpected happened. Please try again! 🔄",
      timestamp: new Date().toISOString(),
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apis: {
      gemini1: !!process.env.GEMINI_API_KEY1,
      gemini2: !!process.env.GEMINI_API_KEY2,
    },
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Voice Bot server running on port ${PORT}`)
  console.log(
    `🧠 Gemini API 1: ${
      process.env.GEMINI_API_KEY1 ? "✅ Ready" : "❌ Missing"
    }`
  )
  console.log(
    `🧠 Gemini API 2: ${
      process.env.GEMINI_API_KEY2 ? "✅ Ready" : "❌ Missing"
    }`
  )
  console.log(`💡 Strategy: Gemini API 1 → Gemini API 2 → Nice error`)
})
