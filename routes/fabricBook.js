const express = require('express');
const request = require('request');
const colors = require('colors');
const middleware = require('../middleware');
const Material = require('../models/material');
const routeFunctions = require('../middleware/routeFunctions');

const { getFabricBook, picLink } = routeFunctions;

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
  // destructure req
  const { fabricBooks } = req.body;
  const newBooks = {
    Items: [],
    TenantToken: req.session.TenantToken,
    UserToken: req.session.UserToken,
  };

  for (let i = 0; i < Object.keys(fabricBooks).length; i += 1) {
    fabricBooks[i].image = picLink(fabricBooks[i].image);
    const newBook = getFabricBook(fabricBooks[i]);
    newBooks.Items.push(newBook);
  }

  // send to Skuvault
  request(
    {
      method: 'POST',
      url: 'https://app.skuvault.com/api/products/createProducts',
      headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
      json: true,
      body: newBooks,
    }, (err, response, body) => {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('back');
      } else if (response.statusCode === 202) {
        // logic for error/success flashes
        console.log('Submitted, response: ' + response.statusCode.toString().yellow + ' ' + body.Status.yellow);
        const errors = [];
        body.Errors.forEach((error) => {
          const skuError = error.Sku + ': ' + error.ErrorMessages;
          console.log('ERROR '.red + skuError); // log the error
          errors.push(skuError);
        });
        req.flash('error', errors.join('<br>'));
        res.redirect('back');
      } else if (response.statusCode === 200) {
        console.log('Submitted, response: ' + response.statusCode.toString().green + ' ' + body.Status.green);
        req.flash('success', 'SKUs Created successfully!');
        res.redirect('/fabricBooks');
      } else {
        console.log('Submitted, response: ' + response.statusCode.toString().red + ' ' + body.Status.red);
        body.Errors.forEach((error) => {
          console.log('ERROR '.red + error.Sku + ': ' + error.ErrorMessages);
        });
        req.flash('error', 'Possible error, unexpected response code: ' + response.statusCode);
        res.redirect('back');
      }
    },
  );
});

module.exports = router;
