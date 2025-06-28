// models/Money.js
const mongoose = require("mongoose");

const moneySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  programId: { type: mongoose.Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "completed" },
  invoiceId: { type: String, required: true, unique: true },
  programType: { type: String, required: true }, // Program type
  comment: { type: String, required: true }, // Add comment field
}, { timestamps: true });

const Money = mongoose.model("Money", moneySchema);
module.exports = Money;
