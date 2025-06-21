// models/PatientVisit.js
const mongoose = require('mongoose');

const patientVisitSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient',   required: true },
  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evolution', required: false },
  session:    { type: mongoose.Schema.Types.ObjectId, ref: 'Session',   required: false },
  date:       { type: Date,                                      required: true },
  time:       { type: String,                                    required: true },
  gender:     { type: String, enum: ['male','female'],           required: true }
}, { timestamps: true });

module.exports = mongoose.model('PatientVisit', patientVisitSchema);
