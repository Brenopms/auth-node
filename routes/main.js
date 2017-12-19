'use strict'
const express = require('express');

const utils = require('../utils');

const router = express.Router();

//Render home page
router.get('/', (req, res) => {
  res.render('index.jade');
});

//Render the Dashboard page
router.get('/dashboard', utils.requireLogin, (req, res) => {
  res.render('dashboard.jade');
});

module.exports = router;