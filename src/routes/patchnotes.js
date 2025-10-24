const express = require('express');
const router = express.Router();
const PatchNote = require('../models/patchNoteEntity');

module.exports = function () {

    router.get('/add', async (req, res) => {
        try {
            const types = await PatchNote.getTypes();
            const versions = await PatchNote.getAllVersions();
            const recentPatchNotes = await PatchNote.getRecentTen();

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

    return router;
};
