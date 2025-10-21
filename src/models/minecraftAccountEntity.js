const pool = require('../db');

module.exports = {
  async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT ID, MC_USERNAME, MC_UUID, AVATAR_URL, CREATED_AT
       FROM MINECRAFT_ACCOUNT
       WHERE USER_ID = ?`,
      [userId]
    );
    return rows;
  },

  async getById(accountId) {
    const [rows] = await pool.query(
      `SELECT * FROM MINECRAFT_ACCOUNT WHERE ID = ?`,
      [accountId]
    );
    return rows[0];
  },

  async create(userId, mcUsername, mcUUID = null, avatarUrl = null) {
    const [result] = await pool.query(
      `INSERT INTO MINECRAFT_ACCOUNT (USER_ID, MC_USERNAME, MC_UUID, AVATAR_URL, CREATED_AT)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, mcUsername, mcUUID, avatarUrl]
    );
    return result.insertId;
  },

  async delete(accountId) {
    return pool.query(`DELETE FROM MINECRAFT_ACCOUNT WHERE ID = ?`, [accountId]);
  },

  async getByUUID(mcUUID) {
    const [rows] = await pool.query(`SELECT * FROM MINECRAFT_ACCOUNT WHERE MC_UUID = ?`, [mcUUID]);
    return rows[0];
  }
};
