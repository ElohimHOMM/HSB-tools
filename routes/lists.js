var express = require('express');
var router = express.Router();
var path = require('path');

var basePath = path.join(__dirname, '..', 'src', 'lists');

router.use(express.static(path.join(__dirname, '..', 'public')));
router.get('/sacks', function(req, res, next) {
  res.sendFile(path.join(basePath, 'sacks.html'));
});
router.get('/enigma', function(req, res, next) {
  res.sendFile(path.join(basePath, 'enigma.html'));
});

module.exports = router;