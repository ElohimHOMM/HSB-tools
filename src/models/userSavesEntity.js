const pool = require('../db');

module.exports = {
  async get(userId, pageKey) {
    const [rows] = await pool.query(
      `SELECT * FROM USER_SAVES WHERE USER_ID = ? AND PAGE_KEY = ?`,
      [userId, pageKey]
    );
    return rows[0] || null;
  },

  async upsert(userId, pageKey, dataJson) {
    const now = new Date();
    const [result] = await pool.query(
      `INSERT INTO USER_SAVES (USER_ID, PAGE_KEY, DATA, CREATED_AT, UPDATED_AT)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         DATA = VALUES(DATA),
         UPDATED_AT = VALUES(UPDATED_AT)`,
      [userId, pageKey, dataJson, now, now]
    );
    return result.insertId;
  },

  async delete(userId, pageKey) {
    return pool.query(
      `DELETE FROM USER_SAVES WHERE USER_ID = ? AND PAGE_KEY = ?`,
      [userId, pageKey]
    );
  },

  async getAllByUser(userId) {
    const [rows] = await pool.query(
      `SELECT PAGE_KEY, DATA, UPDATED_AT FROM USER_SAVES WHERE USER_ID = ?`,
      [userId]
    );
    return rows;
  }
};
