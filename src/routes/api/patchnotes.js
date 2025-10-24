const express = require('express');
const router = express.Router();
const PatchNote = require('../../models/patchNoteEntity');

module.exports = function () {
    router.post('', async (req, res) => {
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

    router.patch('/:id', async (req, res) => {
        try {
            const patchNoteId = req.params.id;
            const { version, type, note } = req.body;

            if (!version || !type) {
                return res.status(400).json({ message: 'Version and Type are required.' });
            }

            const result = await PatchNote.updateById(patchNoteId, { version, type, note });

            if (result.affectedRows > 0) {
                res.json({ message: 'Patch note updated successfully!' });
            } else {
                res.status(404).json({ message: 'Patch note not found.' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error.' });
        }
    });


    router.delete('/:id', async (req, res) => {
        try {
            const patchNoteId = req.params.id;

            if (!patchNoteId) {
                return res.status(400).json({ message: 'Patch note ID required.' });
            }

            // TODO: Optional: check user permissions here

            const result = await PatchNote.deleteById(patchNoteId);

            if (result.affectedRows > 0) {
                res.json({ message: 'Patch note deleted successfully!' });
            } else {
                res.status(404).json({ message: 'Patch note not found.' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error.' });
        }
    });

    return router;
};