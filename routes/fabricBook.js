const express = require('express');
const request = require('request');
const middleware = require('../middleware');
const Material = require('../models/material');

const router = express.Router();

router.get('/', middleware.isLoggedIn, (req, res) => {
  // Get all made material contents and care instructions
  Material.find({}, (err, allMaterial) => {
    if (err) {
      console.log(err);
    } else {
      res.render('fabricBooks', { allMaterial });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  // destructure req body
});
