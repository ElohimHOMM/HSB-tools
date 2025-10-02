const express = require('express');
const path = require('path');

const basePath = path.join(__dirname, '..', 'src', 'calculators');

module.exports = function (publicPath) {
  const router = express.Router();

  router.get('/magicfind', function (req, res, next) {
    res.sendFile(path.join(basePath, 'magicfind.html'));
  });

  return router;
};