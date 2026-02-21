const { connectDB, Case } = require("./models/case");

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};