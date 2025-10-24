const express = require('express');
const router = express.Router();
const PatchNote = require('../models/patchNoteEntity');
const { requireLogin, requireAdmin } = require('../middleware/auth');
const { formatDate } = require('../middleware/format');

module.exports = function () {

    router.get('/add', requireLogin, requireAdmin, async (req, res) => {
        try {
            const types = await PatchNote.getTypes();
            const versions = await PatchNote.getAllVersions();
            const recentPatchNotes = await PatchNote.getRecentTen();

            const formattedNotes = recentPatchNotes.map(note => ({
                ...note,
                CREATED_AT: formatDate(note.CREATED_AT),
                UPDATED_AT: note.UPDATED_AT ? formatDate(note.UPDATED_AT) : '—'
            }));

            res.render('pages/patchnotes/add', { types, versions, formattedNotes })
        } catch (err) {
            console.error(err)
            res.status(500).send('Server error')
        }
    });

    return router;
};
