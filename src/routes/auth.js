const express = require('express');
const bcrypt = require('bcrypt');
// const db = require('../util/db'); // however you access MySQL

module.exports = function () {
  const router = express.Router();

  // --- REGISTER ---
  router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Missing username or password' });

    try {
      const hashed = await bcrypt.hash(password, 10);

      await db.query(
        'INSERT INTO USER (NAME, PASSWORD, EMAIL, CREATED_AT) VALUES (?, ?, ?, NOW())',
        [username, hashed, email || null]
      );

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY')
        return res.status(409).json({ error: 'Username or email already exists' });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // --- LOGIN ---
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const [rows] = await db.query('SELECT * FROM USER WHERE NAME = ?', [username]);
      const user = rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.PASSWORD);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      // Store user ID in session
      req.session.userId = user.ID;
      req.session.username = user.NAME;

      res.json({ message: 'Login successful', username: user.NAME });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // --- LOGOUT ---
  router.post('/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('hsbtools.sid');
      res.json({ message: 'Logged out' });
    });
  });

  // --- CHECK SESSION (optional helper) ---
  router.get('/session', (req, res) => {
    if (req.session.userId) {
      res.json({ loggedIn: true, username: req.session.username });
    } else {
      res.json({ loggedIn: false });
    }
  });

  return router;
};