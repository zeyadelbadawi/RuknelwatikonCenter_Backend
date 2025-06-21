const mongoose = require('mongoose');

const accountantSchema = new mongoose.Schema({
  name: { type: String, required: true },                         // Name is required
  email: { type: String, required: true, unique: true },          // Unique constraint
  password: { type: String, required: true },                     // Will be hashed before saving
  role: { type: String, default: 'accountant', enum: ['accountant'] } // Enforced role
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Accountant = mongoose.model('Accountant', accountantSchema);
module.exports = Accountant;
