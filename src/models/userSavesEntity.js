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
      `SELECT * FROM USER_SAVES WHERE ID = ?`,
      [accountId]
    );
    return rows[0];
  },

  async delete(userSavesId) {
    return pool.query(`DELETE FROM USER_SAVES WHERE ID = ?`, [userSavesId]);
  },

  async getByUUID(mcUUID) {
    const [rows] = await pool.query(`SELECT * FROM MINECRAFT_ACCOUNT WHERE MC_UUID = ?`, [mcUUID]);
    return rows[0];
  }
};
