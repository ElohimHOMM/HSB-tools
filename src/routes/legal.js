const express = require('express');
const path = require('path');

module.exports = function () {
  const router = express.Router();

  router.get('/compliance', function (req, res, next) {
    res.render('pages/legal/compliance', { title: 'Privacy & Cookie Policy' });
  });

  router.get('/terms', function (req, res, next) {
    res.render('pages/legal/terms', { title: 'Terms of Service' });
  });

  return router;
};