// models/PhysicalTherapyExam.js
const mongoose = require('mongoose');

const physicalTherapyExamSchema = new mongoose.Schema(
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
    score: {
      type: Number,
      default: 0, // Store the exam score
    },
    examDate: {
      type: Date,
      default: Date.now, // Automatically set when created
    },
    lastModified: {
      type: Date,
      default: Date.now, // Automatically set when modified
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

const PhysicalTherapyExam = mongoose.model('PhysicalTherapyExam', physicalTherapyExamSchema);

module.exports = PhysicalTherapyExam;
