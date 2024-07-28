const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { check, validationResult } = require('express-validator');

//Create User
router.post('/', [
  check('email').isEmail(),
  check('name').notEmpty(),
  check('mobile').isMobilePhone()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, name, mobile } = req.body;
  try {
    const newUser = new User({ email, name, mobile });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Retrieve User Details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
