const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from root
app.use(express.static(path.join(__dirname, "..")));

// Default route (loads index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working on Vercel 🚀" });
});

// GROQ API route
app.post("/api/groq", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_KEY) {
      return res.status(500).json({ error: "Missing GROQ_KEY" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// IMPORTANT: No app.listen()
module.exports = app;