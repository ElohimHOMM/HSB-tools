var express = require('express');

module.exports = function() {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  return router;
}