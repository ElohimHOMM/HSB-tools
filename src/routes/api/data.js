const express = require('express');
const router = express.Router();
const DataEntity = require('../../models/dataEntity');

module.exports = function () {

    router.get('/:name', async (req, res) => {
        const name = req.params.name;

        try {
            const data = await DataEntity.findByName(name);
            if (!data) {
                return res.status(404).json({ message: 'No Data for the required key found.' });
            }

            res.status(200).json({ data });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
}