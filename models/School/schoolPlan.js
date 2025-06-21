// models/PhysicalTherapyPlan.js
const mongoose = require('mongoose');

const schoolPlanSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', // Reference to the Patient model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    filePath: {
      type: String, // Stores the file path of the uploaded document
    },
    fileName: {
      type: String, // Stores the original file name
    },
    lastModified: {
      type: Date,
      default: Date.now, // Automatically set when modified
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

const SchoolPlan = mongoose.model('SchoolPlan', schoolPlanSchema);

module.exports = SchoolPlan;

