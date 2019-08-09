const express = require('express');
const request = require('request');
const middleware = require('../middleware');
const Classification = require('../models/classification');
const Supplier = require('../models/supplier');

const router = express.Router();

router.get('/', middleware.isLoggedIn, (req, res) => {
  res.render('sync');
});

router.get('/classifications', middleware.isLoggedIn, (req, res) => {
  const auth = {
    TenantToken: req.session.TenantToken,
    UserToken: req.session.UserToken,
  };

  request({
    method: 'POST',
    url: 'https://app.skuvault.com/api/products/getClassifications',
    headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
    json: true,
    body: auth,
  }, (err, response, body) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: { message: err } });
    } else if (response.statusCode === 200) {
      // Update database here
      Classification.deleteMany({}, error => console.log(error));
      const newClasses = [];
      for (let i = 0; i < body.Classifications.length; i += 1) {
        const newClass = {
          name: body.Classifications[i].Name,
          isEnabled: body.Classifications[i].IsEnabled,
        };
        newClasses.push(newClass);
      }
      Classification.insertMany(newClasses, error => console.log(error));
      res.status(200).send({ success: { message: 'Classifications updated successfully!' } });
    } else {
      res.status(response.statusCode).send({ error: { message: `Error ${response.statusCode}: ${body.Errors}` } });
    }
  });
});

router.get('/suppliers', middleware.isLoggedIn, (req, res) => {
  const auth = {
    TenantToken: req.session.TenantToken,
    UserToken: req.session.UserToken,
  };

  request({
    method: 'POST',
    url: 'https://app.skuvault.com/api/products/getSuppliers',
    headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
    json: true,
    body: auth,
  }, (err, response, body) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: { message: err } });
    } else if (response.statusCode === 200) {
      // Update database here
      Supplier.deleteMany({}, error => console.log(error));
      const newSupps = [];
      for (let i = 0; i < body.Suppliers.length; i += 1) {
        const newSupp = {
          name: body.Suppliers[i].Name,
          isEnabled: body.Suppliers[i].IsEnabled,
        };
        newSupps.push(newSupp);
      }
      Supplier.insertMany(newSupps, error => console.log(error));
      res.status(200).send({ success: { message: 'Suppliers updated successfully!' } });
    } else {
      res.status(response.statusCode).send({ error: { message: `Error ${response.statusCode}: ${body.Errors}` } });
    }
  });
});

module.exports = router;
