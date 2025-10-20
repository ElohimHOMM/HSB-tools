const express = require('express');
const router = express.Router();
const User = require('../models/userEntity'); // adjust path if needed


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

    return router;
};