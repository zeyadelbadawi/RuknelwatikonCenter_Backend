const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({

    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    Payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

const PendingMoney = mongoose.model('PendingMoney', MoneySchema);
module.exports = PendingMoney;
