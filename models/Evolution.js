const mongoose = require('mongoose');

const evolutionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  service: { type: String, required: false },
  disabilityType: { type: String, required: false },
  evolutionNote: { type: String, required: false },
  weeks: { type: Number, required: false },
  sessionsPerWeek: { type: Number, required: false },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  done: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
  type: { type: String, required: true },
  school: { type: String, required: false },
  services: [{ type: String, required: false }],    // ← new field
  patientdescription: { type: String, required: false }, // msh 3arf leh wallahi bs lw shelo feh 7aga htboz
  latestSessionDate: { type: Date, default: null },  // New field for latest session date
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: false},  
}, { timestamps: true });

const Evolution = mongoose.model('Evolution', evolutionSchema);
module.exports = Evolution;
