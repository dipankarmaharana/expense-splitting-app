const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitMethod: { type: String, enum: ['Equal', 'Exact', 'Percentage'], required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      share: { type: Number, required: true } // Can be amount or percentage based on splitMethod
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
