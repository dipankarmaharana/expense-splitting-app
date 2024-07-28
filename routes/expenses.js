const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User');
const { stringify } = require('csv-stringify');  

// Download Balance Sheet
router.get('/download', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy')
      .populate('participants.user');

    const records = expenses.map(expense => ({
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paidBy.name,
      splitMethod: expense.splitMethod,
      participants: expense.participants.map(p => `${p.user.name}: ${p.share}`).join(', '),
      date: expense.date.toISOString()
    }));

    const columns = [
        { key: 'description', header: 'DESCRIPTION' },
        { key: 'amount', header: 'AMOUNT' },
        { key: 'paidBy', header: 'PAID BY' },
        { key: 'splitMethod', header: 'SPLIT METHOD' },
        { key: 'participants', header: 'PARTICIPANTS' },
        { key: 'date', header: 'DATE' }
      ];

    stringify(records, {
      header: true,
      columns: columns
    }, (err, output) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="balance_sheet.csv"');
      res.send(output);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add Expense
router.post('/', async (req, res) => {
    const { description, amount, paidBy, splitMethod, participants } = req.body;
    try {
      if (splitMethod === 'Equal') {
        const share = amount / participants.length;
        participants.forEach(participant => {
          participant.share = share;
        });
      } else if (splitMethod === 'Exact') {
        const total = participants.reduce((acc, participant) => acc + participant.share, 0);
        if (total !== amount) {
          return res.status(400).json({ message: 'Exact amounts must add up to the total expense amount' });
        }
      } else if (splitMethod === 'Percentage') {
        const totalPercentage = participants.reduce((acc, participant) => acc + participant.share, 0);
        if (totalPercentage !== 100) {
          return res.status(400).json({ message: 'Percentages must add up to 100%' });
        }
        participants.forEach(participant => {
          participant.share = (participant.share / 100) * amount;
        });
      }
  
      const expense = new Expense({ description, amount, paidBy, splitMethod, participants });
      await expense.save();
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// Retrieve Individual User Expenses
router.get('/user/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ 'participants.user': req.params.userId });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve Overall Expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
