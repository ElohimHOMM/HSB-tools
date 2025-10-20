const express = require('express');
const User = require('../../models/userEntity');
const MinecraftAccount = require('../../models/minecraftAccountEntity');
const router = express.Router();

module.exports = function () {

  router.post('/signup', async (req, res) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      await User.createUser(username, password, email);
      res.status(201).json({ message: 'User created successfully!' });

    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Username already exists.' });
      }
      res.status(500).json({ message: 'Internal server error.\n' + err });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      const valid = await User.validatePassword(password, user.PASSWORD);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
      
      const mcAccounts = await MinecraftAccount.getByUserId(user.ID);
      const avatarUrl = mcAccounts.length ? mcAccounts[0].AVATAR_URL : '/images/default_avatar.png';

      req.session.userId = user.ID;
      req.session.user = {
        id: user.ID,
        name: user.NAME,
        email: user.EMAIL || null,
        avatarUrl: avatarUrl
      };

      res.json({ message: 'Login successful!' })

    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ message: 'Internal server error.' })
    }
  });

  router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
      return res.json({
        loggedIn: true,
        user: req.session.user,
      });
    }
    res.json({ loggedIn: false });
  });

  router.post('/logout', (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ message: 'Logout failed.' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out successfully.' });
      });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  return router;
};
