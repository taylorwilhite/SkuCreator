const express = require('express');
const request = require('request');
const rp = require('request-promise-native');
const middleware = require('../middleware');
const Counter = require('../models/counter');
const Color = require('../models/color');
const Classification = require('../models/classification');
const Supplier = require('../models/supplier');
const skuCreation = require('../middleware/skuCreation');
const { retrieveModel } = require('../middleware/routeFunctions');


const router = express.Router();

router.get('/', middleware.isLoggedIn, async (req, res) => {
  // Pull all colors and pass to view
  const allClass = await retrieveModel(Classification);
  const allSupp = await retrieveModel(Supplier);
  Color.find({}, (err, allColors) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { allColors, allClass, allSupp });
    }
  });
});

router.post('/', middleware.isLoggedIn, async (req, res) => {
  try {
    if (req.body.fbCode) {
      const fbBody = {
        ProductSKUs: [
          req.body.fbCode[0],
        ],
        TenantToken: req.session.TenantToken,
        UserToken: req.session.UserToken,
      };

      req.body.fbInfo = await rp({
        method: 'POST',
        url: 'https://app.skuvault.com/api/products/getProducts',
        headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
        json: true,
        body: fbBody,
      })
        // eslint-disable-next-line no-return-assign
        .then(response => response.Products[0].Attributes)
        .catch(err => console.log(err));
    }

    skuCreation(req.body, req.session.TenantToken, req.session.UserToken).then((data) => {
      // Update upc counter with new upc
      Counter.findOneAndUpdate({ _id: 'productupc' }, { $set: { sequence_value: data.upc } }).exec();
      // Submit to SKUvault
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
