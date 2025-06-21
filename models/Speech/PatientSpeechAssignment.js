// models/PatientSpeechAssignment.js
const mongoose = require('mongoose');

const speechAssignmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'suspended'],
      default: 'active',
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const PatientSpeechAssignment = mongoose.model(
  'PatientSpeechAssignment',
  speechAssignmentSchema
);

module.exports = PatientSpeechAssignment;
