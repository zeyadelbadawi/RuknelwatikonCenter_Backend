const mongoose = require('mongoose');

const patientEvaluationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to Patient
  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation', required: true }, // Reference to Evaluation
  dateCreated: { type: Date, default: Date.now },
});

const PatientEvaluation = mongoose.model('PatientEvaluation', patientEvaluationSchema);
module.exports = PatientEvaluation;
