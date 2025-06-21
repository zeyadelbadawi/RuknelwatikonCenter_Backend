const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    method: { type: String, enum: ['cash', 'visa'], required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true, refPath: 'type' },
    note: { type: String },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }  // ✅ Add this
  });
  
    module.exports = mongoose.model('Payment', paymentSchema);
