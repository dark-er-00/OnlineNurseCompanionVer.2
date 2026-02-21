const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time notifications
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// Google Sheets sync endpoint (can also be triggered manually)
app.post("/api/sync/sheets", async (req, res) => {
  try {
    const { syncSheetToDatabase } = require("./services/googleSheetsSync");
    const newCases = await syncSheetToDatabase(io);
    res.json({ 
      success: true, 
      message: `Synced ${newCases.length} new cases`,
      cases: newCases 
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync from Google Sheets" });
  }
});

// Get sync status
app.get("/api/sync/status", async (req, res) => {
  try {
    const { connectDB, Case } = require("./models/case");
    await connectDB();
    
    const totalCases = await Case.countDocuments();
    const lastCase = await Case.findOne().sort({ createdAt: -1 });
    
    res.json({
      totalCases,
      lastSyncTime: lastCase?.createdAt || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get sync status" });
  }
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
    
    // Notify all clients about the update
    io.emit("case-updated", updatedCase);
    
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
    
    // Notify all clients about the deletion
    io.emit("case-deleted", { id: caseId });
    
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

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Schedule Google Sheets sync every minute (for testing)
// In production, you might want to adjust this interval
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled Google Sheets sync...");
  try {
    const { syncSheetToDatabase } = require("./services/googleSheetsSync");
    const newCases = await syncSheetToDatabase(io);
    if (newCases.length > 0) {
      console.log(`Synced ${newCases.length} new cases from Google Sheets`);
    }
  } catch (error) {
    console.error("Scheduled sync error:", error);
  }
});

// Start server if running directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server, io };
