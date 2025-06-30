const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadPost');
const Post = require('../models/Post');

router.post('/create', auth, upload.single('media'), async (req, res) => {
  const post = new Post({
    userId: req.user.id,
    content: req.body.content,
    media: req.file ? '/uploads/posts/' + req.file.filename : ''
  });
  await post.save();
  res.redirect('/home');
  res.status(201).json({ message: 'Post created', post });
});

router.get('/all', auth, async (req, res) => {
  const posts = await Post.find().populate('userId', 'name username profilePic').sort({ createdAt: -1 });
  res.json(posts);
});

router.put('/:id', auth, upload.single('media'), async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  post.content = req.body.content;

  if (req.file) {
    post.media = '/uploads/posts/' + req.file.filename;
  }

  await post.save();
  res.redirect('/home');
  res.json({ message: 'Post updated', post });
});


router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
  await post.deleteOne();
  res.redirect('/home');
});

module.exports = router;
