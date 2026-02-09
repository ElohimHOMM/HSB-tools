const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs').promises

const SackService = require('../service/pages/checklists/sacks/SackService')
const DataEntity = require('../models/dataEntity')
const Data = require('../models/dataEntity')
const { type } = require('os')

module.exports = function () {

  router.get('/sacks', async function (req, res, next) {
    try {
      sacks = await SackService.getSacks(path, fs)

      res.render('pages/lists/sacks', { 
        title: 'Sacks Checklist - HSB Tools',
        sacks: SackService.normalizeSacks(sacks)
      })
    } catch (err) {
      console.error(err)
      res.status(500).render('error', { message: 'Failed to load sacks list' })
    }
  })

  router.get('/enigma', async function (req, res, next) {
    try {
      const souls = await Data.findByName('ENIGMA_JSON')
      console.log(JSON.parse(souls.VALUE))

      res.render('pages/lists/enigma', { 
        title: 'Enigma Soul Checklist - HSB Tools', 
        enigmaJson: JSON.parse(souls.VALUE)
      })
    } catch (err) {
      console.error(err)
      res.status(500).render('error', { message: 'Failed to load enigma soul list' })
    }
  })

  return router
}