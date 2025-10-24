const pool = require('../db');

const PatchNote = {

    async getOrCreateType(typeName) {
        const [rows] = await pool.query(
            'SELECT ID FROM PATCH_NOTE_TYPE WHERE NAME = ?',
            [typeName]
        );

        if (rows.length) return rows[0].ID;

        const [result] = await pool.query(
            'INSERT INTO PATCH_NOTE_TYPE (NAME, CREATED_AT) VALUES (?, NOW())',
            [typeName]
        );

        return result.insertId;
    },

    async create(version, typeName, note = null) {
        const typeId = await this.getOrCreateType(typeName.trim());

        if (typeName.toLowerCase() === 'title') {
            const existingRows = await this.getIdByVersionAndTypeId(version, typeId);
            console.log(existingRows.length + " - " + existingRows);
            if (existingRows.length > 0) {
                throw new Error(`A 'Title' already exists for version ${version}.`);
            }
        }

        const [result] = await pool.query(
            `INSERT INTO PATCH_NOTES (VERSION, TYPE_ID, PATCH_NOTE, CREATED_AT)
       VALUES (?, ?, ?, NOW())`,
            [version.trim(), typeId, note]
        );

        return result.insertId;
    },

    async getAll() {
        const [rows] = await pool.query(
            `SELECT pn.ID, pn.VERSION, pn.PATCH_NOTE, t.NAME as TYPE, pn.CREATED_AT
       FROM PATCH_NOTES pn
       JOIN PATCH_NOTE_TYPE t ON pn.TYPE_ID = t.ID
       ORDER BY pn.CREATED_AT DESC`
        );
        return rows;
    },

    async getRecentTen() {
        const [rows] = await pool.query(`
            SELECT pn.ID, pn.VERSION, t.NAME AS TYPE, pn.PATCH_NOTE, pn.CREATED_AT, pn.UPDATED_AT
        FROM PATCH_NOTES pn
        JOIN PATCH_NOTE_TYPE t ON pn.TYPE_ID = t.ID
        ORDER BY pn.CREATED_AT DESC
        LIMIT 10
        `);
        return rows;
    },

    async seedDefaultTypes() {
        const defaultTypes = ['Title', 'Fix', 'Added', 'Removed', 'Updated', 'Deprecated'];
        for (const type of defaultTypes) {
            await this.getOrCreateType(type);
        }
        console.log('Default patch note types seeded.');
    },

    async getTypes() {
        const [rows] = await pool.query('SELECT ID, NAME FROM PATCH_NOTE_TYPE ORDER BY NAME ASC');
        return rows;
    },

    async getAllVersions() {
        const [rows] = await pool.query('SELECT VERSION FROM PATCH_NOTES GROUP BY VERSION ORDER BY MAX(CREATED_AT) DESC');
        return rows;
    },

    async getIdByVersionAndTypeId(version, typeId) {
        const [rows] = await pool.query(`SELECT ID FROM PATCH_NOTES WHERE VERSION = ? AND TYPE_ID = ?`, [version, typeId]);
        return rows;
    },

    async deleteById(id) {
        const [result] = await pool.query('DELETE FROM PATCH_NOTES WHERE ID = ?', [id]);
        return result;
    },

    async updateById(id, { version, type, note }) {
        const typeId = await this.getOrCreateType(type);
        const [result] = await pool.query(
            'UPDATE PATCH_NOTES SET VERSION = ?, TYPE_ID = ?, PATCH_NOTE = ?, UPDATED_AT = NOW() WHERE ID = ?',
            [version, typeId, note, id]
        );
        return result;
    }

};

module.exports = PatchNote;
