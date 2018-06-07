// Allow loading environment from .env
require('dotenv').load();
// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var middleware = require('./middleware');

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

// Routes

app.get('/', middleware.isLoggedIn, function(req, res){
	res.render('index');
});

app.post('/', function(req, res){
	// Get info from body
	var sku = req.body.sku.parent;
	var desc = req.body.variantTitle;
	var classification = req.body.classification;
	var brand = req.body.brand;
	var supName = req.body.supp.Name;
	var supPrim = req.body.supp.Primary;
	var skuColor = req.body.sku.color;
	var colorName = req.body.variantColor;
	var sizes = req.body.size;
	var regLanded = req.body.landedCost;
	var regRaw = req.body.supp.Cost;
	var picture = req.body.picture;
	var fbCode = req.body.fbCode;
	var plusLanded = req.body.plus.landedCost;
	var plusRaw = req.body.plus.rawCost;

	// Create Empty object to push SKUs into
	var newSKUs = {
		"Items":[],
			"TenantToken":req.session.TenantToken,
			"UserToken":req.session.UserToken
		};
	// Format Correctly
	sizes.forEach(function(size){
		var landedCost = ''
		var rawCost = ''
		//For loop for sizes
		if(size == 'P1X' || size == 'P2X' || size =='P3X'){
			var landedCost = plusLanded;
			var rawCost = plusRaw;
		} else {
			var landedCost = regLanded;
			var rawCost = regRaw;
		};

		var newSize =
		{  
			"Sku":sku + skuColor + "-" + size,
			"Description":desc,
			"Classification":classification,
			"Supplier":"JuJu",
		    "Brand":brand,
		    "PartNumber":colorName + " " + size,
		    "Cost":landedCost,
		    "VariationParentSku":sku,
		    "Pictures":[  
		       picture
		    ],
		    "Attributes":{  
		       "Color":colorName,
		       "Size":size,
		       "FB Code":fbCode,
		    },
		    "SupplierInfo":[  
		      {  
		         "SupplierName":"JuJu",
		         "IsPrimary":true,
		         "IsActive":true,
		         "Cost":rawCost
		      }
		   ]
		};
		newSKUs["Items"].push(newSize);
		var newSize = {};
	});
	
	var newSkuJSON = JSON.stringify(newSKUs);
	console.log(newSKUs);
	// Submit to SKUvault
	request(
		{method: 'POST',
		url: 'https://app.skuvault.com/api/products/createProducts',
		headers: [{'Content-Type': 'application/json', 'Accept': 'application/json'}],
		json: true,
		body: newSKUs
		}, function(err, response, body){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the status response
			res.redirect("/");
		}
	})
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', function(req, res){
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
			res.redirect('/login');
		} else {
			// if not there redirect and log error
			if(!body.TenantToken){
				console.log('Incorrect credentials');
				res.redirect('back');
			} else {
				// set cookie and go home
				req.session.TenantToken = body.TenantToken;
				req.session.UserToken = body.UserToken;
				res.redirect('/');
			}
		}
	});
});

// Start Server
app.listen(process.env.PORT || 3000, function(){
	console.log('Server is running on port 3000');
});