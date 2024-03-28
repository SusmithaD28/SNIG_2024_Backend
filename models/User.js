// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  resolution: { type: String, enum: ['0', '144p', '360p', '720p'] },
  text: { type: String }
});

module.exports = mongoose.model('User', userSchema);
