// Set Requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const User = require('./models/user');
// var seedDB = require('./seeds');

const app = express();

// Allow loading environment from .env
require('dotenv').load();

// Routes
const indexRoutes = require('./routes/index');
const skuRoutes = require('./routes/skuCreation');
const colorRoutes = require('./routes/colors');
const fabricBookRoutes = require('./routes/fabricBook');
const materialRoutes = require('./routes/materials');
const inboundDocsRoutes = require('./routes/inboundDoc');

// DB setup
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/skuCreateDb';
const db = mongoose.connection;

mongoose.connect(databaseUri)
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(`Database connection error: ${err.message}`));

// Config
// seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make flash and user available
app.use((req, res, next) => {
  res.locals.activeUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Route information
app.use('/', indexRoutes);
app.use('/skuCreation', skuRoutes);
app.use('/colors', colorRoutes);
app.use('/fabricBooks', fabricBookRoutes);
app.use('/materials', materialRoutes);
app.use('/inboundDocs', inboundDocsRoutes);

// Start Server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
