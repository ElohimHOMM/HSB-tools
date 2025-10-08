const express = require('express');
const path = require('path');

module.exports = function () {
  const router = express.Router();

  router.get('/magicfind', function (req, res, next) {
    res.render('pages/calculators/magicfind', { title: 'Magic Find Calculator - HSB Tools' })
  });

  return router;
};