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
        const typeId = await this.getOrCreateType(typeName);

        const [result] = await pool.query(
            `INSERT INTO PATCH_NOTES (VERSION, TYPE_ID, PATCH_NOTE, CREATED_AT)
       VALUES (?, ?, ?, NOW())`,
            [version, typeId, note]
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

    /**
     * Seeds default patch note types if they don't exist.
     * Call this on app startup.
     */
    async seedDefaultTypes() {
        const defaultTypes = ['Fix', 'Added', 'Removed', 'Updated', 'Deprecated'];
        for (const type of defaultTypes) {
            await this.getOrCreateType(type);
        }
        console.log('Default patch note types seeded.');
    },

    async getTypes() {
        const [rows] = await pool.query('SELECT ID, NAME FROM PATCH_NOTE_TYPE ORDER BY NAME ASC');
        return [rows];
    },

    async getAllVersions() {
        const [rows] = await pool.query('SELECT VERSION FROM PATCH_NOTES ORDER BY CREATED_AT DESC');
        return [rows];
    }


};

module.exports = PatchNote;
