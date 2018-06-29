var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var User = require('../models/user');
var middleware = require('../middleware');

router.get('/', (req, res) => res.redirect('skuCreation'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
	request(
	{method: 'POST',
	url: 'https://app.skuvault.com/api/gettokens',
	headers: [{'Content-Type': 'application/json', 'Accept': 'application/json'}],
	json: true,
	body: {"Email":req.body.username, "Password":req.body.password}
	}, function(err, response, body){
		// check response for tokens
		if(err){
			console.log(err);
			req.flash('error', 'There was an error submitting. Try again.');
			res.redirect('/register');
		} else {
			// if not there redirect and log error
			if(!body.TenantToken){
				req.flash('error', 'Incorrect credentials. Please Try again.');
				res.redirect('back');
			} else {
				// register and direct to login
				var newUser = new User({username: req.body.username});
				console.log(req.body.username);
				User.register(newUser, req.body.password, function(err, user){
					if(err){
						req.flash('error', err.message);
						return res.redirect('register');
					} else {
						req.flash('success', 'Registration succeeded! Please login');
						res.redirect('/login');
					}
				});
			}
		}
	});
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password. Please register or try again.'}), function(req, res){
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
				res.redirect('/skuCreation');
			}
		}
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You have been logged out');
	res.redirect('/login');
});

module.exports = router;