import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const caseSchema = new mongoose.Schema({
  dateTime: String,
  studentName: String,
  course: String,
  email: String,
  symptoms: String,
  duration: String,
  painLevel: Number,
  dangerFlag: Boolean,
  canAttendClass: Boolean,
  status: String,
  urgencyLevel: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Case = mongoose.models.Case || mongoose.model("Case", caseSchema);

function computeUrgency({ painLevel, dangerFlag, canAttendClass }) {
  if (dangerFlag === true) return "URGENT";
  if (painLevel >= 8) return "URGENT";
  if (!canAttendClass && painLevel >= 5) return "MEDIUM";
  if (painLevel >= 5) return "MEDIUM";
  return "LOW";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      dateTime,
      studentName,
      course,
      email,
      symptoms,
      duration,
      painLevel,
      dangerFlag,
      canAttendClass,
      status,
    } = req.body;

    const existing = await Case.findOne({ dateTime, email });

    if (existing) {
      return res.status(200).json({ message: "Already saved" });
    }

    const urgencyLevel = computeUrgency({
      painLevel: Number(painLevel),
      dangerFlag: dangerFlag === "Yes",
      canAttendClass: canAttendClass === "Yes",
    });

    await Case.create({
      dateTime,
      studentName,
      course,
      email,
      symptoms,
      duration,
      painLevel: Number(painLevel),
      dangerFlag: dangerFlag === "Yes",
      canAttendClass: canAttendClass === "Yes",
      status,
      urgencyLevel,
    });

    res.status(200).json({ message: "Case saved successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to save case" });
  }
}