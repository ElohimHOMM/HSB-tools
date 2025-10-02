var express = require('express');
var path = require('path');

module.exports = function (publicPath) {
  const router = express.Router();

  router.get('/', function (req, res, next) {
    res.sendFile(path.join(publicPath, 'html', 'index.html'));
  });

  return router;
};