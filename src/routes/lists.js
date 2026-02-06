const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const SackService = require('../service/pages/checklists/sacks/SackService');

module.exports = function () {

  router.get('/sacks', async function (req, res, next) {
    try {
      sacks = await SackService.getSacks(path, fs);

      res.render('pages/lists/sacks', { 
        title: 'Sacks Checklist - HSB Tools',
        sacks: SackService.normalizeSacks(sacks)
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Failed to load sacks list' });
    }
  });

  router.get('/enigma', function (req, res, next) {
    res.render('pages/lists/enigma', { title: 'Enigma Soul Checklist - HSB Tools' })
  });

  return router;
};