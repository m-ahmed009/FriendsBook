const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get('/user/:username', auth, async (req, res) => {
  try {
    const username = req.params.username;

    const profileUser = await User.findOne({ username });
    if (!profileUser) return res.status(404).send('User not found');

    const posts = await Post.find({ userId: profileUser._id })
      .sort({ createdAt: -1 })
      .populate('userId');

    const isOwner = req.user.username === username;

    res.render('profile', {
      title: `${profileUser.name} | Profile`,
      profileUser,
      posts,
      isOwner,
      user: req.user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
