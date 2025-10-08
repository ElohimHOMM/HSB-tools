var express = require('express');
var path = require('path');

module.exports = function () {
  const router = express.Router();

  router.get('/', function (req, res, next) {
    res.render('pages/index', { title: 'Home - HSB Tools' });
  });

  return router;
};