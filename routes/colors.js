var express = require('express');
var router = express.Router();
var passport = require('passport');
var middleware = require('../middleware');
var Color = require('../models/color');

router.post('/', middleware.isLoggedIn, (req, res) => {
	var newColor = req.body.color.toUpperCase();
	var newColorCode = req.body.colorCode.toUpperCase();

	// send color and code to dB
	Color.findOne({color: newColor}, (err, foundColor) => {
		if(err){
			console.log(err);
			res.status(400).send(err);
		} else {
			// if there, give an error
			if(foundColor){
				res.status(202).send({error: 'This color already exists!'});
			} else {
				// if not there, create and send ok to client
				Color.create({color: newColor, colorCode: newColorCode}, (err, newlyCreated) => {
					if(err){
						console.log(err);
						res.status(400).send({error: 'There was a problem creating this color, please try again'});
					} else {
						res.status(200).send({success: newlyCreated});
					}
				});
			}
		}
	});
});

module.exports = router;