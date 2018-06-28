var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var User = require('../models/user');
var middleware = require('../middleware');

router.get('/', function(req, res){
	res.render('login');
});

router.post('/', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password.'}), function(req, res){
	// form object to send to skuvault
	var skuvaultLogin = {
		"Email":req.body.username,
		"Password":req.body.password
	}
	// send object
	request(
	{method: 'POST',
	url: 'https://app.skuvault.com/api/gettokens',
	headers: [{'Content-Type': 'application/json', 'Accept': 'application/json'}],
	json: true,
	body: skuvaultLogin
	}, function(err, response, body){
		// check response for tokens
		if(err){
			console.log(err);
			req.flash('error', 'There was an error submitting. Try again.');
			res.redirect('/login');
		} else {
			// if not there redirect and log error
			if(!body.TenantToken){
				req.flash('error', 'Incorrect credentials. Please Try again.');
				res.redirect('back');
			} else {
				// set cookie and go home
				req.session.TenantToken = body.TenantToken;
				req.session.UserToken = body.UserToken;
				req.flash('success', 'Login succeeded!');
				res.redirect('/');
			}
		}
	});
});

module.exports = router;