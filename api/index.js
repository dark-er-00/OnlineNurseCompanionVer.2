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

// Admin API routes
app.get("/api/admin/cases", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

app.put("/api/admin/cases/:id", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    const caseId = req.params.id;
    const { status, urgencyLevel } = req.body;
    
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { status, urgencyLevel },
      { new: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update case" });
  }
});

app.delete("/api/admin/cases/:id", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    const caseId = req.params.id;
    
    const deletedCase = await Case.findByIdAndDelete(caseId);
    
    if (!deletedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json({ message: "Case deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete case" });
  }
});

app.get("/api/admin/cases/:id", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    const caseId = req.params.id;
    
    const caseItem = await Case.findById(caseId);
    
    if (!caseItem) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    res.json(caseItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch case" });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    
    const totalCases = await Case.countDocuments();
    const urgentCases = await Case.countDocuments({ urgencyLevel: "URGENT" });
    const mediumCases = await Case.countDocuments({ urgencyLevel: "MEDIUM" });
    const lowCases = await Case.countDocuments({ urgencyLevel: "LOW" });
    
    const openCases = await Case.countDocuments({ status: "pending" });
    const closedCases = await Case.countDocuments({ status: "resolved" });
    
    res.json({
      totalCases,
      urgentCases,
      mediumCases,
      lowCases,
      openCases,
      closedCases
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
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
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "You are a supportive mental health wellness assistant for students. Provide empathetic, practical guidance based on questionnaire responses. Never diagnose, always encourage professional help for serious concerns."
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1500
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

// Start server if running directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;