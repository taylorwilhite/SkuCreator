// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var session = require('express-session');
var middleware = require('./middleware');
var flash = require('connect-flash');
var Counter = require('./models/counter');

// Allow loading environment from .env
require('dotenv').load();

// Routes
var indexRoutes = require('./routes/index');
var skuRoutes = require('./routes/skuCreation');

var databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/skuCreateDb';
var db = mongoose.connection;

mongoose.connect(databaseUri)
	.then(() => console.log('Database Connected'))
	.catch(err => console.log('Database connection error: ' + err.message));
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function(){
// 	console.log('Database Connected');
// });

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