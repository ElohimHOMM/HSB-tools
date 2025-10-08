const express = require('express');
const path = require('path');

module.exports = function () {
  const router = express.Router();

  router.get('/sacks', function (req, res, next) {
    res.render('pages/lists/sacks', { title: 'Sacks Checklist - HSB Tools' })
  });

  router.get('/enigma', function (req, res, next) {
    res.render('pages/lists/enigma', { title: 'Enigma Soul Checklist - HSB Tools' })
  });

  return router;
};