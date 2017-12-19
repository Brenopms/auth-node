'use strict'
const bcrypt = require('bcryptjs');
const express = require('express');

const models = require('../models');
const utils = require('../utils');

const router = express.Router();

/**
 * Render the registration page.
 */
router.get('/register', (req, res) => {
  res.render('register.jade', { csrfToken: req.csrfToken() });
});

/**
 * Create a new user account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/register', function(req, res) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);

  let user = new models.User({
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    email:      req.body.email,
    password:   hash,
  });
  user.save(function(err) {
    if (err) {
      let error = 'Something bad happened! Please try again.';

      if (err.code === 11000) {
        error = 'That email is already taken, please try another.';
      }

      res.render('register.jade', { error: error });
    } else {
      utils.createUserSession(req, res, user);
      res.redirect('/dashboard');
    }
  });
});

/**
 * Render the login page.
 */
router.get('/login', (req, res) => {
  res.render('login.jade', { csrfToken: req.csrfToken() });
});

/**
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/login', (req, res) => {
  models.User.findOne({ email: req.body.email }, 'firstName lastName email password data', (err, user) => {
    if (!user) {
      res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        utils.createUserSession(req, res, user);
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
      }
    }
  });
});

/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/logout', (req, res)  => {
  if (req.session) {
    req.session.reset();
  }
  res.redirect('/');
});

module.exports = router;