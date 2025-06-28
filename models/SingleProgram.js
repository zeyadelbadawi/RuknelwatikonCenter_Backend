const mongoose = require("mongoose");

const singleProgramSchema = new mongoose.Schema(
  {
    patientid: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    programkind: { type: [String], required: true },  // Change to an array of strings
  },
  { timestamps: true }
);

const SingleProgram = mongoose.model("SingleProgram", singleProgramSchema);
module.exports = SingleProgram;
