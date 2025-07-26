var express = require('express');
var router = express.Router();
var path = require('path');

var basePath = path.join(__dirname, '..', 'src', 'calculators');

router.use(express.static(path.join(__dirname, '..', 'public')));
router.get('/magicfind', function(req, res, next) {
  res.sendFile(path.join(basePath, 'magicfind.html'));
});

module.exports = router;