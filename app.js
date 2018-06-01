// Allow loading environment from .env
require('dotenv').load();
// Set Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

// Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Routes

app.get('/', function(req, res){
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
	var landedCost = req.body.landedCost;
	var rawCost = req.body.supp.Cost;
	var picture = req.body.picture;
	var fbCode = req.body.fbCode;

	var newSKUs = {
		"Items":[],
			"TenantToken":process.env.MY_TENANT,
			"UserToken":process.env.MY_USER
		};
	// Format Correctly - CURRENTLY ONLY ONE FOR TESTING
	sizes.forEach(function(size){
		//For loop for sizes
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
	// console.log(newSkuJSON);
	// console.log(newSKUs);
	// Submit to SKUvault NOT WORKING FIX THIS POST REQUEST
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
  			console.log('body:', body); // Print the HTML for the Google homepage.;
			res.redirect("/");
		}
	})
	//redirect
	// res.redirect("/");
});

// Start Server
app.listen(process.env.PORT || 3000, function(){
	console.log('Server is running on port 3000');
});