const pool = require('../db');

const Data = {
  async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM DATA WHERE NAME = ?', [name]);
    return rows[0];
  }
};

module.exports = Data;