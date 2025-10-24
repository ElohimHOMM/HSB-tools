const express = require('express');
const router = express.Router();
const PatchNote = require('../models/patchNoteEntity');

module.exports = function () {

    router.get('/add', async (req, res) => {
        try {
            const types = await PatchNote.getTypes();
            const versions = await PatchNote.getAllVersions();
            const recentPatchNotes = await PatchNote.getRecentTen();

            if (versions && versions.length) {
                for (let v of versions) {
                    console.log('Version:', v.VERSION);
                }
            }

            const formattedNotes = recentPatchNotes.map(note => ({
                ...note,
                CREATED_AT: new Date(note.CREATED_AT).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                UPDATED_AT: note.UPDATED_AT
                    ? new Date(note.UPDATED_AT).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : '—'
            }));

            res.render('pages/patchnotes/add', { types, versions, formattedNotes })
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
