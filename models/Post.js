const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  media: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
