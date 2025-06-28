const mongoose = require("mongoose");

const fullProgramSchema = new mongoose.Schema(
  {
    patientid: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "not active" },
  },
  { timestamps: true }
);

const FullProgram = mongoose.model("FullProgram", fullProgramSchema);
module.exports = FullProgram;
