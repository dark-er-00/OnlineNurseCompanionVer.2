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

export default async function handler(req, res) {
  try {
    await connectDB();
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
}