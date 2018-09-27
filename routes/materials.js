const express = require('express');
const middleware = require('../middleware');
const Material = require('../models/material');

const router = express.Router();

router.post('/', middleware.isLoggedIn, (req, res) => {
  const newMaterial = req.body.newMaterial.toUpperCase();
  const newCare = req.body.newCare.toUpperCase();

  // send color and code to dB
  Material.findOne({ material: newMaterial }, (err, foundMaterial) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else if (foundMaterial) {
      // if there, give an error
      res.status(202).send({ error: 'This Material already exists!' });
    } else {
      // if not there, create and send ok to client
      Material.create({ material: newMaterial, care: newCare }, (error, newlyCreated) => {
        if (error) {
          console.log(error);
          res.status(400).send({ error: 'There was a problem creating this material, please try again' });
        } else {
          res.status(200).send({ success: newlyCreated });
        }
      });
    }
  });
});

module.exports = router;
