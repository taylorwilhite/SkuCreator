const express = require('express');
const passport = require('passport');
const request = require('request');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => res.redirect('skuCreation'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  request(
    {
      method: 'POST',
      url: 'https://app.skuvault.com/api/gettokens',
      headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
      json: true,
      body: { Email: req.body.username, Password: req.body.password },
    }, (err, response, body) => {
    // check response for tokens
      if (err) {
        console.log(err);
        req.flash('error', 'There was an error submitting. Try again.');
        res.redirect('/register');
      } else if (!body.TenantToken) {
        // if not there redirect and log error
        req.flash('error', 'Incorrect credentials. Please Try again.');
        res.redirect('back');
      } else {
        // register and direct to login
        const newUser = new User({ username: req.body.username });
        User.register(newUser, req.body.password, (error, user) => {
          if (error) {
            req.flash('error', err.message);
            return res.redirect('register');
          }
          req.flash('success', `Registration of ${user.username} succeeded! Please login`);
          return res.redirect('/login');
        });
      }
    },
  );
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password. Please register or try again.' }), (req, res) => {
  // form object to send to skuvault
  const skuvaultLogin = {
    Email: req.body.username,
    Password: req.body.password,
  };
  // send object
  request(
    {
      method: 'POST',
      url: 'https://app.skuvault.com/api/gettokens',
      headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
      json: true,
      body: skuvaultLogin,
    }, (err, response, body) => {
      // check response for tokens
      if (err) {
        console.log(err);
        req.flash('error', 'There was an error submitting. Try again.');
        res.redirect('/login');
      } else if (!body.TenantToken) {
        // if not there redirect and log error
        req.flash('error', 'Incorrect credentials. Please Try again.');
        res.redirect('back');
      } else {
        // set cookie and go home
        req.session.TenantToken = body.TenantToken;
        req.session.UserToken = body.UserToken;
        req.flash('success', 'Login succeeded!');
        res.redirect('/skuCreation');
      }
    },
  );
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/login');
});

module.exports = router;
