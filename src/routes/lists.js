var express = require('express');
var router = express.Router();
var path = require('path');

var basePath = path.join(publicpath, 'html', 'lists');

router.use(express.static(publicPath));
router.get('/sacks', function(req, res, next) {
  res.sendFile(path.join(basePath, 'sacks.html'));
});
router.get('/enigma', function(req, res, next) {
  res.sendFile(path.join(basePath, 'enigma.html'));
});

module.exports = router;