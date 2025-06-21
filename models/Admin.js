const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // The password will be hashed
  role: { type: String, default: 'admin' },

}, 

{ timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
