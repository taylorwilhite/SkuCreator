const express = require('express');
const middleware = require('../middleware');
const Color = require('../models/color');

const router = express.Router();

router.get('/', middleware.isLoggedIn, (req, res) => {
  Color.find({}, (err, allColors) => {
    if (err) {
      req.flash('error', err);
      res.redirect('back');
    }
    res.render('colors', { allColors });
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  const newColor = req.body.newColor.toUpperCase();
  const newColorCode = req.body.newCode.toUpperCase();

  // send color and code to dB
  Color.findOne({ $or: [{ color: newColor }, { colorCode: newColorCode }] }, (err, foundColor) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else if (foundColor) {
      // if there, give an error
      res.status(202).send({ error: 'This color or code already exists!' });
    } else {
      // if not there, create and send ok to client
      Color.create({ color: newColor, colorCode: newColorCode }, (error, newlyCreated) => {
        if (error) {
          console.log(error);
          res.status(400).send({ error: 'There was a problem creating this color, please try again' });
        } else {
          res.status(200).send({ success: newlyCreated });
        }
      });
    }
  });
});

router.put('/:id', middleware.isLoggedIn, (req, res) => {
  res.status(200).send({ 'heres the id': req.params.id });
});

router.delete('/:id', middleware.isLoggedIn, (req, res) => {
  res.status(200).send({ 'deleted the id': req.params.id });
});

module.exports = router;
