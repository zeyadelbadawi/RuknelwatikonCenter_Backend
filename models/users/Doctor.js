const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // The password will be hashed
  phone: { type: String, required: false },
  role: { type: String, default: 'doctor' },
  title: { type: String, required: false }, //not used yet
  availability: { type: String, enum: ['Available', 'Not Available']}


}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
