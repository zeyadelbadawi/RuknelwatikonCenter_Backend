const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  volunteerType: { type: String, required: false },  // نوع العمل التطوعي
  availableHours: { type: String, required: false },  // ساعات العمل المتاحة
  password: { type: String, required: true },  // هنخزنها مشفرة
  role: { type: String, default: 'volunteer' },
}, { timestamps: true });

const VolunteerStudent = mongoose.model('VolunteerStudent', volunteerSchema);
module.exports = VolunteerStudent;
