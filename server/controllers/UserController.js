const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required.' });
    }
    if (!['owner', 'assistant', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be owner, assistant, or user.' });
    }
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    if (err.errors && err.errors[0] && err.errors[0].message) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'role', 'email'] });
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'username', 'role'] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createByOwner = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Username, email, and role are required.' });
    }
    if (!['owner', 'assistant', 'user', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Role must be owner, assistant, staff, or user.' });
    }
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 hours
    // Create user with blank password
    const user = await User.create({ username, email, role, password: '!', resetToken, resetTokenExpiry });
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendMail({
      to: email,
      subject: 'Set your password for CounterPulse Shop',
      html: `<p>Hello ${username},</p><p>Your account has been created. Please <a href="${resetUrl}">click here to set your password</a>. This link will expire in 2 hours.</p>`
    });
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    if (err.errors && err.errors[0] && err.errors[0].message) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return res.status(400).json({ error: 'Token, email, and new password are required.' });
    }
    const user = await User.findOne({ where: { email, resetToken: token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Token has expired.' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ message: 'Password has been reset. You can now log in.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Username, email, and role are required.' });
    }
    if (!['owner', 'assistant', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be owner, assistant, or user.' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Check for username/email conflicts
    const existingUsername = await User.findOne({ where: { username, id: { $ne: id } } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const existingEmail = await User.findOne({ where: { email, id: { $ne: id } } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    user.username = username;
    user.email = email;
    user.role = role;
    await user.save();
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
