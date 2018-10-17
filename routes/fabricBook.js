const express = require('express');
const request = require('request');
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
      } else if (response.statusCode === 200) {
        console.log(`Submitted, response: ${response.statusCode.toString()} ${body.Status}`);
        req.flash('success', 'SKUs Created successfully!');
        res.redirect('/skuCreation');
      } else {
        // logic for error/success flashes
        console.log(`Submitted, response: ${response.statusCode.toString()} ${body.Status}`);
        const errors = [];
        body.Errors.forEach((error) => {
          let newError;
          if (error.Sku) {
            newError = `${error.Sku}: ${error.ErrorMessages}`;
          } else {
            newError = `${error.ErrorMessages}`;
          }
          console.log(`ERROR ${newError}`); // log the error
          errors.push(newError);
        });
        req.flash('error', errors.join('<br>'));
        res.redirect('back');
      }
    },
  );
});

module.exports = router;
