const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = function () {

  router.get('/sacks', function (req, res, next) {
    let enigmaJson = 
    res.render('pages/lists/sacks', { title: 'Sacks Checklist - HSB Tools', enigmaJson: enigmaJson })
  });

  router.get('/enigma', function (req, res, next) {
    res.render('pages/lists/enigma', { title: 'Enigma Soul Checklist - HSB Tools' })
  });

  return router;
};