const express = require('express');
const router = express.Router();
const MinecraftAccount = require('../models/minecraftAccountEntity');
const User = require('../models/userEntity');
const { requireLogin } = require('../middleware/auth');

module.exports = function () {

    router.get('/:username/profile', async (req, res) => {
        const username = req.params.username;

        try {
            const user = await User.findByUsername(username);
            if (!user) return res.status(404).render('404', { message: 'User not found' });

            const minecraftAccounts = await User.getMinecraftAccounts(user.ID);

            // Render profile view
            res.render('profile', {
                userProfile: {
                    id: user.ID,
                    name: user.NAME,
                    email: user.EMAIL,
                    avatarUrl: user.AVATAR_URL || '/images/default_avatar.png',
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

            console.log("Found account: " + user)

            res.render('profile/manage', {
                title: `${username}'s Minecraft Account`,
                userProfile: user,
                minecraftAccount: mcAccount
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        }
    });

    return router;
};