// Set Requirements
var express = require('express');
var app = express();

// Config
app.set('view engine', 'ejs');

// Routes

// Start Server
app.listen(3000, function(){
	console.log('Server is running on port 3000');
});