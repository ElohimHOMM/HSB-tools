const express = require('express');
const router = express.Router();
const MinecraftAccount = require('../models/minecraftAccountEntity');
const User = require('../models/userEntity');
const { requireLogin } = require('../middleware/auth');

function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

module.exports = function () {

    router.get('/:username/profile', async (req, res) => {
        const username = req.params.username;

        try {
            const user = await User.findByUsername(username);
            if (!user) return res.status(404).render('404', { message: 'User not found' });

            const minecraftAccounts = await User.getMinecraftAccounts(user.ID);
            let avatarUrl = minecraftAccounts.length >= 1 && minecraftAccounts[0].AVATAR_URL ? minecraftAccount.AVATAR_URL : '/images/default_avatar.png'

            // Render profile view
            res.render('pages/profile/summary', {
                userProfile: {
                    id: user.ID,
                    name: user.NAME,
                    email: user.EMAIL,
                    avatarUrl: avatarUrl,
                    createdAt: user.CREATED_AT
                },
                minecraftAccounts
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Internal server error' });
        }
    });

    router.get('/profile/minecraft', requireLogin, (req, res) => {
        // Redirect to username-specific route
        res.redirect(`/${req.session.user.name}/profile/minecraft`);
    });

    router.get('/:username/profile/minecraft', requireLogin, async (req, res) => {
        const { username } = req.params;

        // Auth check: owner or admin
        if (req.session.user.name !== username && !req.session.user.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        try {
            const user = await User.findByUsername(username);
            if (!user) return res.status(404).send('User not found');

            const mcAccount = await MinecraftAccount.getByUserId(user.ID);
            console.log(mcAccount);

            res.render('pages/profile/minecraft', {
                title: `${username}'s Minecraft Account`,
                userProfile: user,
                minecraftAccount: chunkArray(mcAccount, 2)
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        }
    });

    router.post('/profile/minecraft/link', requireLogin, async (req, res) => {
        try {
            const userId = req.session.user.id;
            const { mcUsername } = req.body;

            if (!mcUsername) {
                return res.status(400).json({ success: false, message: 'Minecraft username is required.' });
            }

            let mcUUID = null;
            try {
                const mojangRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${mcUsername}`);
                if (mojangRes.ok) {
                    const mojangData = await mojangRes.json();
                    mcUUID = mojangData.id;
                }
            } catch (e) {
                console.warn('Could not fetch UUID, proceeding without it');
            }

            const avatarUrl = mcUUID
                ? `https://crafatar.com/avatars/${mcUUID}?size=64`
                : `/api/minecraft/avatar/${mcUsername}`;

            const id = await MinecraftAccount.create(userId, mcUsername, mcUUID, avatarUrl);
            // TODO: Nicht jedes Mal Session updaten, sondern neues Feld in Minecraft Account Datenbank Tabelle -> Ranking und in der Session ist immer die Nummer 1. Update nur nach Verschieben.
            req.session.user.avatarUrl = avatarUrl;

            return res.json({ success: true, message: 'Minecraft account linked!', id, avatarUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });

    return router;
};