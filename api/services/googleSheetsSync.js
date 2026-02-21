const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const { connectDB, Case } = require("../models/case");

// Google Sheet configuration
const SPREADSHEET_ID = "1k5md0tfuIjnx1De-wgbH6XckHtB6Rfg5GxY6mhxodeQ";

// Track last synced row to detect new entries
let lastSyncedRowIndex = 0;

/**
 * Calculate urgency level based on symptoms assessment
 * @param {number} painLevel - Pain level 1-10
 * @param {string} dangerFlag - "Yes" or "No"
 * @param {string} canAttendClass - "Yes" or "No"
 * @returns {string} URGENT, MEDIUM, or LOW
 */
function calculateUrgencyLevel(painLevel, dangerFlag, canAttendClass) {
  const pain = parseInt(painLevel, 10) || 0;
  const isDanger = dangerFlag?.toLowerCase() === "yes";
  const canAttend = canAttendClass?.toLowerCase() === "yes";

  // URGENT conditions
  if (isDanger === true) return "URGENT";
  if (pain >= 8) return "URGENT";

  // MEDIUM conditions
  if (!canAttend && pain >= 5) return "MEDIUM";
  if (pain >= 5) return "MEDIUM";

  // LOW - default
  return "LOW";
}

/**
 * Initialize Google Sheet with service account authentication
 */
async function initializeSheet() {
  try {
    // For service account authentication
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error("Error initializing Google Sheet:", error);
    throw error;
  }
}

/**
 * Read data from Google Sheet
 */
async function readSheetData() {
  try {
    const doc = await initializeSheet();
    const sheet = doc.sheets[0]; // First sheet
    const rows = await sheet.getRows();

    return rows.map((row, index) => ({
      rowIndex: index + 2, // +2 because row 1 is headers and rows are 0-indexed
      dateTime: row.get("dateTime") || row.get("Date/Time") || "",
      studentName: row.get("studentName") || row.get("Student Name") || "",
      course: row.get("course") || row.get("Course") || "",
      email: row.get("email") || row.get("Email") || "",
      symptoms: row.get("symptoms") || row.get("Symptoms") || "",
      duration: row.get("duration") || row.get("Duration") || "",
      painLevel: row.get("painLevel") || row.get("Pain Level") || "0",
      dangerFlag: row.get("dangerFlag") || row.get("Danger Flag") || "No",
      canAttendClass: row.get("canAttendClass") || row.get("Can Attend Class") || "Yes",
      status: row.get("status") || row.get("Status") || "pending",
    }));
  } catch (error) {
    console.error("Error reading Google Sheet:", error);
    throw error;
  }
}

/**
 * Sync new rows from Google Sheet to MongoDB
 * @param {Object} io - Socket.io instance for notifications
 * @returns {Array} Array of newly synced cases
 */
async function syncSheetToDatabase(io = null) {
  try {
    await connectDB();

    const sheetData = await readSheetData();

    if (sheetData.length === 0) {
      console.log("No data found in Google Sheet");
      return [];
    }

    const newCases = [];
    const currentMaxIndex = await getMaxRowIndex();

    // Process rows that haven't been synced yet
    for (const row of sheetData) {
      if (row.rowIndex <= currentMaxIndex) {
        continue; // Skip already synced rows
      }

      // Calculate urgency level
      const urgencyLevel = calculateUrgencyLevel(
        row.painLevel,
        row.dangerFlag,
        row.canAttendClass
      );

      // Check if case already exists in database (by dateTime and email)
      const existingCase = await Case.findOne({
        dateTime: row.dateTime,
        email: row.email,
      });

      if (!existingCase) {
        // Create new case
        const newCase = await Case.create({
          dateTime: row.dateTime,
          studentName: row.studentName,
          course: row.course,
          email: row.email,
          symptoms: row.symptoms,
          duration: row.duration,
          painLevel: parseInt(row.painLevel, 10) || 0,
          dangerFlag: row.dangerFlag?.toLowerCase() === "yes",
          canAttendClass: row.canAttendClass?.toLowerCase() === "yes",
          status: row.status || "pending",
          urgencyLevel: urgencyLevel,
        });

        newCases.push(newCase);
        console.log(`Synced new case: ${newCase._id}`);

        // Notify frontend via Socket.io
        if (io) {
          io.emit("new-case", newCase);
        }
      }

      // Update last synced index
      if (row.rowIndex > lastSyncedRowIndex) {
        lastSyncedRowIndex = row.rowIndex;
      }
    }

    // Store last synced index in database for persistence
    await storeLastSyncedIndex(Math.max(lastSyncedRowIndex, currentMaxIndex));

    return newCases;
  } catch (error) {
    console.error("Error syncing Google Sheet to database:", error);
    throw error;
  }
}

/**
 * Get the maximum row index from database
 */
async function getMaxRowIndex() {
  try {
    const lastCase = await Case.findOne().sort({ createdAt: -1 });
    // We'll use a simple approach - store row index in a separate collection
    const syncMeta = await Case.db.collection("syncMeta").findOne({ key: "lastSyncedRowIndex" });
    return syncMeta?.value || 0;
  } catch (error) {
    console.error("Error getting max row index:", error);
    return 0;
  }
}

/**
 * Store the last synced row index
 */
async function storeLastSyncedIndex(index) {
  try {
    await Case.db.collection("syncMeta").updateOne(
      { key: "lastSyncedRowIndex" },
      { $set: { key: "lastSyncedRowIndex", value: index } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error storing last synced index:", error);
  }
}

/**
 * Full sync - sync all rows from sheet (use with caution)
 */
async function fullSync(io = null) {
  try {
    lastSyncedRowIndex = 0; // Reset to sync all
    return await syncSheetToDatabase(io);
  } catch (error) {
    console.error("Error in full sync:", error);
    throw error;
  }
}

module.exports = {
  syncSheetToDatabase,
  fullSync,
  calculateUrgencyLevel,
  readSheetData,
};
