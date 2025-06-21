// models/PatientOccupationalTherapyAssignment.js
const mongoose = require('mongoose');

const PatientoccupationalTherapyAssignmentSchema = new mongoose.Schema(
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

const PatientoccupationalTherapyAssignment = mongoose.model(
  'PatientoccupationalTherapyAssignment',
  PatientoccupationalTherapyAssignmentSchema
);

module.exports = PatientoccupationalTherapyAssignment;
