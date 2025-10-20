const express = require('express');
const router = express.Router();
const MinecraftAccount = require('../../models/minecraftAccountEntity');


module.exports = function () {

    router.post('/add', async (req, res) => {
        const userId = req.session.user?.id;
        const { mcUsername, mcUUID, avatarUrl } = req.body;

        if (!userId) return res.status(401).json({ message: 'Not logged in' });
        if (!mcUsername) return res.status(400).json({ message: 'Username required' });

        try {
            // Check if user already has an account
            const existing = await MinecraftAccount.getByUserId(userId);
            if (existing) {
                return res.status(409).json({ message: 'Minecraft account already linked' });
            }

            const newId = await MinecraftAccount.create(userId, mcUsername, mcUUID || null, avatarUrl || `/api/minecraft/avatar/${mcUsername}`);
            res.json({ message: 'Minecraft account linked', id: newId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Remove Minecraft Account
    router.post('/remove', async (req, res) => {
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: 'Not logged in' });

        try {
            const account = await MinecraftAccount.getByUserId(userId);
            if (!account) return res.status(404).json({ message: 'No linked account' });

            await MinecraftAccount.delete(account.ID);

            // Update session avatar
            req.session.user.avatarUrl = '/images/default_avatar.png';

            res.json({ message: 'Minecraft account removed' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
}