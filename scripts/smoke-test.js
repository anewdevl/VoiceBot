const { spawn } = require("child_process")
const http = require("http")
const path = require("path")
const fs = require("fs")

const root = path.join(__dirname, "..")
const logFile = path.join(root, "smoke-debug.log")
function log(line) {
  fs.appendFileSync(logFile, line + "\n")
}
log("--- smoke start " + new Date().toISOString())
const port = String(37777 + Math.floor(Math.random() * 1000))

function request(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? Buffer.from(JSON.stringify(body), "utf8") : null
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: pathname,
        method,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": payload.length,
            }
          : {},
      },
      (res) => {
        let chunks = ""
        res.on("data", (c) => {
          chunks += c
        })
        res.on("end", () => {
          let json
          try {
            json = JSON.parse(chunks)
          } catch {
            json = chunks
          }
          resolve({ status: res.statusCode, json })
        })
      }
    )
    req.on("error", reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

;(async () => {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: root,
    env: { ...process.env, PORT: port },
    stdio: ["ignore", "pipe", "pipe"],
  })

  let stderr = ""
  child.stderr.on("data", (d) => {
    stderr += d.toString()
  })
  child.stdout.on("data", (d) => {
    process.stdout.write(d.toString())
  })

  let health
  try {
    for (let i = 0; i < 60; i++) {
      if (child.exitCode !== null) {
        log("early exit " + child.exitCode + " stderr:" + stderr.slice(0, 2000))
        console.error("\nServer exited early, code:", child.exitCode)
        if (stderr) console.error("stderr:", stderr)
        process.exit(1)
      }
      await sleep(250)
      try {
        const h = await request("GET", "/api/health")
        if (h.status === 200) {
          health = h.json
          break
        }
      } catch (_) {
        /* still starting */
      }
    }

    if (!health) {
      log("no health stderr:" + stderr.slice(0, 2000))
      console.error("Server never responded on port", port)
      if (stderr) console.error("stderr:", stderr)
      process.exit(1)
    }

    log("health " + JSON.stringify(health))
    console.log("\n[HEALTH]", JSON.stringify(health))

    const chat = await request("POST", "/api/chat", {
      message: "Say only the word TEST_OK",
    })
    log("chat " + chat.status + " " + JSON.stringify(chat.json).slice(0, 1500))
    console.log(
      "[CHAT]",
      chat.status,
      JSON.stringify(chat.json).slice(0, 1200)
    )

    if (chat.status !== 200) process.exit(1)
  } finally {
    child.kill("SIGTERM")
    await sleep(400)
    try {
      child.kill("SIGKILL")
    } catch (_) {}
  }
})().catch((e) => {
  try {
    log("fatal " + e.stack)
  } catch (_) {}
  console.error(e)
  process.exit(1)
})
