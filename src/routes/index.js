var express = require('express');
var path = require('path');
var PatchNote = require('../models/patchNoteEntity');

module.exports = function () {
  const router = express.Router();

  router.get('/', async function (req, res, next) {
    const latestPatchnotes = await PatchNote.getLatestVersions(4);
    console.log(latestPatchnotes)
    res.render('pages/index', { title: 'Home - HSB Tools', latestPatchnotes });
  });

  return router;
};