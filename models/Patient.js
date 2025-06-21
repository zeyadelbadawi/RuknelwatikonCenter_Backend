// models/Patient.js
const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    disabilityType: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    address: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, default: "patient" },
    mydescription: { type: String, required: false },
    gender: { type: String, enum: ["male", "female"] },
    lastvisit: { type: Date, required: false },
    // New field for department assignment
    assignedDepartment: {
      type: String,
      required: false,
      enum: ['speech', 'physical', 'occupational', 'psychology'], // Add "physical" here
    },
    assignedDate: { type: Date, required: false },
  },
  { timestamps: true },
)

const Patient = mongoose.model("Patient", patientSchema)
module.exports = Patient
