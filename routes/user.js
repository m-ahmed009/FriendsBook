const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/update', auth, upload.single('profilePic'), async (req, res) => {
  const { name, bio } = req.body;

  try {
    const updatedData = { name, bio };
    if (req.file) {
      updatedData.profilePic = `/uploads/profile/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
    res.redirect('/user/' + req.user.username); // ⬅ Redirect back to profile
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;