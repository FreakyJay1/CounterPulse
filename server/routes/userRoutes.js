const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../utils/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/simple-login', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) return res.status(400).json({ error: 'Username and role required' });
  const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, role });
});
router.get('/', auth(['admin']), UserController.getAllUsers);
router.get('/:id', auth(['admin', 'self']), UserController.getUserById);
router.delete('/:id', auth(['admin']), UserController.deleteUser);

module.exports = router;
