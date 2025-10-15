// models/userModel.js
const pool = require('../db');
const bcrypt = require('bcrypt');

const User = {
  async createUser(username, password, email) {
    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();
    const normalizedEmail = email && email.trim() !== '' ? email.trim() : null;

    await pool.query(
      'INSERT INTO USER (NAME, PASSWORD, EMAIL, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, ?)',
      [username, hashed, normalizedEmail, now, now]
    );
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM USER WHERE NAME = ?', [username]);
    return rows[0];
  },

  async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
};

module.exports = User;