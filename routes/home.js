const router = require('express').Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new Error('User not found in database.');
    }

    const posts = await Post.find().populate('userId').sort({ createdAt: -1 });
    const otherUsers = await User.find({ _id: { $ne: req.user.id } }).select('name username profilePic');

    const userIdStr = req.user._id.toString();

    res.render('home', {
      user,
      userIdStr,
      posts,
      otherUsers
    });
  } catch (err) {
    console.error('Error in /home route:', err.message);
    res.status(500).send('Something went wrong.');
  }
});


module.exports = router;
