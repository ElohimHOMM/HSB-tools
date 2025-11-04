const express = require('express');
const { requireLogin } = require('../../middleware/auth');

const UserSaveService = require('../../services/UserSaveService');

const router = express.Router();

module.exports = function () {
    router.get('/:pageKey', requireLogin, async (req, res) => {
        try {
            const userId = req.session.user?.id;
            const { pageKey } = req.params;

            if (UserSaveService.getService(pageKey) === null) {
                return res.status(400).json({ message: `Unsupported page key: ${pageKey}` });
            }

            const record = await UserSaveService.getUserSave(userId, pageKey);

            if (!record) {
                return res.json({ data: {} }); // Empty for new users
            }

            const parsed = PAGE_SERVICES[pageKey].fromJson(record.DATA);
            res.json({ data: parsed });
        } catch (err) {
            console.error('Error fetching user save:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    router.patch('/:pageKey', requireLogin, async (req, res) => {
        try {
            const userId = req.session.user?.id;
            const { pageKey } = req.params;
            const payload = req.body;

            const Service = PAGE_SERVICES[pageKey];
            if (!Service) {
                return res.status(400).json({ message: `Unsupported page key: ${pageKey}` });
            }

            const jsonData = Service.toJson(payload);
            await UserSaveService.saveUserData(userId, pageKey, jsonData);

            res.json({ message: 'Progress saved successfully' });
        } catch (err) {
            console.error('Error saving user data:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
