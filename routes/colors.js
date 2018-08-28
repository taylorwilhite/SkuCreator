var express = require('express');
var router = express.Router();
var passport = require('passport');
var middleware = require('../middleware');
var Color = require('../models/color');

router.post('/', middleware.isLoggedIn, (req, res) => {
	// res.send({body: 'You got a response!'});
	console.log(req.body);
// send color and code to dB
// if there, give an error
// if not there, create and send ok to client
});

module.exports = router;