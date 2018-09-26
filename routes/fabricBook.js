const express = require('express');
const request = require('request');
const middleware = require('../middleware');
const Material = require('../models/material');
const routeFunctions = require('../middleware/routeFunctions');

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

router.post('/', (req, res) => {
  // destructure req
  const { fabricBooks } = req.body;
  const newBooks = {
    Items: [],
    TenantToken: req.session.TenantToken,
    UserToken: req.session.UserToken,
  };

  for (let i = 0; i < Object.keys(fabricBooks).length; i += 1) {
    const newBook = routeFunctions.getFabricBook(fabricBooks[i]);
    newBooks.Items.push(newBook);
  }

  // send to Skuvault
  
});

module.exports = router;
