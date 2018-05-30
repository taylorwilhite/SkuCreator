// Allow loading environment from .env
require('dotenv').load();
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
	// Get info from body
	var sku = req.body.sku.parent;
	var desc = req.body.variantTitle;
	var classification = req.body.classification;
	var brand = req.body.brand;
	var supName = req.body.supp.Name;
	var supPrim = req.body.supp.Primary;
	var skuColor = req.body.sku.color
	var sizes = req.body.size
	var newSKUs = {"Items":[]};
	// Format Correctly - CURRENTLY ONLY ONE FOR TESTING
	sizes.forEach(function(size){
		//For loop for sizes
		var newSize =
		{  
			"Sku":sku + skuColor + "-" + size,
			"Description":desc,
			"Classification":classification,
			"Supplier":supName,
		    "Brand":brand,
		    // "Pictures":[  
		    //    "http://www.example.com/image.jpg"
		    // ],
		    // "Attributes":{  
		    //    "String":"String"
		    // },
		    "SupplierInfo":[  
		      {  
		         "SupplierName":supName,
		         "IsPrimary":true
		      }
		   ],
		   "TenantToken":process.env.MY_TENANT,
		   "UserToken":process.env.MY_USER
		};
		newSKUs["Items"].push(newSize);
		var newSize = {};
	});
	
	var newSkuJSON = JSON.stringify(newSKUs);
	console.log(newSkuJSON);
	console.log(newSKUs);
	// Submit to SKUvault
	//redirect
	res.redirect("/");
});

// Start Server
app.listen(3000, function(){
	console.log('Server is running on port 3000');
});