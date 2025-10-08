const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../util/database'); // your DB helper
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  try {
    await db.run(
      'INSERT INTO USER (NAME, PASSWORD, EMAIL, CREATED_AT) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, now]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User creation failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await db.get('SELECT * FROM USER WHERE NAME = ?', [username]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.PASSWORD);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.ID;
  req.session.username = user.NAME;

  res.json({ success: true, username: user.NAME });
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;