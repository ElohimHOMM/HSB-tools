const express = require('express');
const path = require('path');

module.exports = function (publicPath) {
  const basePath = path.join(publicPath, 'html', 'calculators');
  const router = express.Router();

  router.get('/magicfind', function (req, res, next) {
    res.sendFile(path.join(basePath, 'magicfind.html'));
  });

  return router;
};