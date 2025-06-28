const mongoose = require("mongoose");

const schoolProgramSchema = new mongoose.Schema(
  {
    patientid: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    unicValue: { type: String, required: true, unique: true },
    status: { type: String, default: "not completed" }, // New field with default value
  },
  { timestamps: true }
);

const SchoolProgram = mongoose.model("SchoolProgram", schoolProgramSchema);
module.exports = SchoolProgram;
