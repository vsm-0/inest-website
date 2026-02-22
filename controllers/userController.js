const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize email
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Pre-check for existing email to provide friendly error
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'You are already registered with us' });
    }

    const user = await User.create({ name, email: normalizedEmail, password, role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    // Handle MongoDB duplicate key error (race condition or index enforcement)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'You are already registered with us' });
    }
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 