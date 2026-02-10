const express = require('express');
const { requireLogin } = require('../../middleware/auth');

const UserSaveService = require('../../service/save/UserSaveService');

const router = express.Router();

module.exports = function () {
    router.get('/:pageKey', requireLogin, async (req, res) => {
        try {
            const userId = req.session.user?.id
            const { pageKey } = req.params

            const Service = UserSaveService.getService(pageKey)
            if (!Service) {
                return res.status(400).json({ message: `Unsupported page key: ${pageKey}` })
            }

            const record = await UserSaveService.load(userId, pageKey)

            if (!record) {
                return res.json({ data: {} })
            }

            const parsed = Service.fromJson(record.DATA)
            res.json({ data: parsed })
        } catch (err) {
            console.error('Error fetching user save:', err)
            res.status(500).json({ message: 'Server error' })
        }
    })

    router.patch('/:pageKey', requireLogin, async (req, res) => {
        try {
            const userId = req.session.user?.id
            const { pageKey } = req.params
            const payload = req.body

            const Service = UserSaveService.getService(pageKey)
            if (!Service) {
                return res.status(400).json({ message: `Unsupported page key: ${pageKey}` })
            }

            const jsonData = Service.toJson(payload)
            await UserSaveService.save(userId, pageKey, jsonData)

            res.json({ message: 'Progress saved successfully' })
        } catch (err) {
            console.error('Error saving user data:', err)
            res.status(500).json({ message: 'Server error' })
        }
    })

    return router;
};
