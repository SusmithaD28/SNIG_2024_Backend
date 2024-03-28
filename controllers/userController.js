// controllers/userController.js
const User = require('../models/User');

exports.getUserVideo = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ resolution: user.resolution, text: user.text });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
