const express = require('express');
const router = express.Router();
const PatchNote = require('../models/patchNoteEntity');

module.exports = function () {

    router.get('/add', async (req, res) => {
        try {
            const [types] = await PatchNote.getTypes()
            const [versions] = await PatchNote.getAllVersions()

            res.render('patchnotes/add', { types, versions })
        } catch (err) {
            console.error(err)
            res.status(500).send('Server error')
        }
    });


    // Handle form submission
    router.post('/add', async (req, res) => {
        try {
            const { version, type, note } = req.body;
            if (!version || !type) {
                return res.status(400).json({ message: 'Version and type are required.' });
            }

            await PatchNote.create(version, type, note);
            res.json({ message: 'Patch note added successfully!' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
