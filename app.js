// Allow loading environment from .env
require('dotenv').load();
// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var middleware = require('./middleware');
var flash = require('connect-flash');

// Routes
var indexRoutes = require('./routes/index');
var skuRoutes = require('./routes/skuCreation');

// Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
	secret: process.env.SESSION_SECRET,
	saveUninitialized: false,
	resave: false,
	cookie: {maxAge: 8 * 60 * 60 * 1000}
}));
app.use(flash());

// make flash available
app.use(function(req, res, next){
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// Route information
app.use('/login', indexRoutes);
app.use('/', skuRoutes);

// Start Server
app.listen(process.env.PORT || 3000, function(){
	console.log('Server is running on port 3000');
});