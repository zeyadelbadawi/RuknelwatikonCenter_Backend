// models/PatientPhysicalTherapyAssignment.js
const mongoose = require('mongoose');

const patientPhysicalTherapyAssignmentSchema = new mongoose.Schema(
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

const PatientPhysicalTherapyAssignment = mongoose.model(
  'PatientPhysicalTherapyAssignment',
  patientPhysicalTherapyAssignmentSchema
);

module.exports = PatientPhysicalTherapyAssignment;
