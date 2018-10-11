const express = require('express');
const colors = require('colors');
const request = require('request');
const middleware = require('../middleware');
const Counter = require('../models/counter');
const Color = require('../models/color');
const skuCreation = require('../middleware/skuCreation');


const router = express.Router();


router.get('/', middleware.isLoggedIn, (req, res) => {
  // Pull all colors and pass to view
  Color.find({}, (err, allColors) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { allColors: allColors });
    }
  });
});

router.post('/', middleware.isLoggedIn, async (req, res) => {
  try {
    skuCreation(req.body, req.session.TenantToken, req.session.UserToken).then((data) => {
      // Update upc counter with new upc
      Counter.findOneAndUpdate({ _id: 'productupc' }, { $set: { sequence_value: data.upc } }).exec();
      // Submit to SKUvault
      console.log(data.skus);
      console.log(data.skus.Items);
      request(
        {
          method: 'POST',
          url: 'https://app.skuvault.com/api/products/createProducts',
          headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
          json: true,
          body: data.skus,
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
            res.redirect('/skuCreation');
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
