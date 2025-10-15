var express = require('express');
const User = require('../../models/userEntity');

module.exports = function () {
  var router = express.Router();

  router.post('/signup', async (req, res) => {
    try {
      const { username, password, email } = req.body;

      // 1️⃣ Basic validation
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      // 2️⃣ Normalize email (optional)
      const normalizedEmail = email && email.trim() !== '' ? email.trim() : null;

      // 3️⃣ Try to create the user
      await User.createUser(username, password, normalizedEmail);

      // 4️⃣ Respond to client
      res.status(201).json({ message: 'User created successfully!' });

    } catch (err) {
      console.error('Signup error:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }

      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  return router;
};
