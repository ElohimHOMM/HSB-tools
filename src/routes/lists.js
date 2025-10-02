const express = require('express');
const path = require('path');

module.exports = function (publicPath) {
  const router = express.Router();

  const basePath = path.join(publicPath, 'html', 'lists');

  router.get('/sacks', function (req, res, next) {
    res.sendFile(path.join(basePath, 'sacks.html'));
  });

  router.get('/enigma', function (req, res, next) {
    res.sendFile(path.join(basePath, 'enigma.html'));
  });

  return router;
};