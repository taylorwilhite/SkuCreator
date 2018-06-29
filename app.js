// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var request = require('request');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var middleware = require('./middleware');
var flash = require('connect-flash');
var User = require('./models/user');
var Counter = require('./models/counter');

// Allow loading environment from .env
require('dotenv').load();

// Routes
var indexRoutes = require('./routes/index');
var skuRoutes = require('./routes/skuCreation');

// DB setup
var databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/skuCreateDb';
var db = mongoose.connection;

mongoose.connect(databaseUri)
	.then(() => console.log('Database Connected'))
	.catch(err => console.log('Database connection error: ' + err.message));

// Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
	secret: process.env.SESSION_SECRET,
	saveUninitialized: false,
	resave: false,
	cookie: {maxAge: 8 * 60 * 60 * 1000},
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // User is not defined yet
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make flash available
app.use(function(req, res, next){
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// Route information
app.use('/', indexRoutes);
app.use('/skuCreation', skuRoutes);

// Start Server
app.listen(process.env.PORT || 3000, function(){
	console.log('Server is running on port 3000');
});