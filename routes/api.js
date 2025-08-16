const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

router.get('/minecraft/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const response = await axios.get(`https://api.minecraftservices.com/minecraft/profile/lookup/name/${username}`);
        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch Minecraft profile' });
    }
});

router.get('/hypixel/profiles/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const config = {
        headers: {
            'API-Key': process.env.DEV_API_KEY
        }
    };
    try {
        const response = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, config);
        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch Minecraft profile' });
    }
});

module.exports = router;