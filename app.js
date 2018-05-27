// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Routes

app.get('/', function(req, res){
	res.render('index');
});

app.post('/', function(req, res){
	console.log(req.body);
});

// Start Server
app.listen(3000, function(){
	console.log('Server is running on port 3000');
});