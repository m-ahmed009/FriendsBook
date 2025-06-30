const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();



router.get('/register', (req, res) => {
  res.render('register', { title: 'FriendBook | Register' });
});

router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const newUser = new User({ name, username, email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: 'Registered Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login', { title: 'FriendBook | Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set token in cookie (important part)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true only in HTTPS production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/api/auth/login');
});

module.exports = router;
