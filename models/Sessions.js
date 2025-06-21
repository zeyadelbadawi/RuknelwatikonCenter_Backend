const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({

  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evolution', required: true }, // Reference to Evaluation
  Sessionname: { type: String, required: true }, // Session name (e.g., "Session 1", "Session 2")
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  done: { type: Boolean, default: false },
  note: { type: String, required: false },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: false},  // not used yet

}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
