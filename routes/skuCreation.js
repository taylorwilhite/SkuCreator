var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var request = require('request');

router.get('/', middleware.isLoggedIn, function(req, res){
	res.render('index');
});

router.post('/', function(req, res){
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
			req.flash('error', err)
			res.redirect("back");
		} else {
			// TODO: ADD LOGIC TO GIVE ACCURATE STATUS FEEDBACK IN FLASH HERE
			if(response.statusCode == 202){
				var errors = [];
				body.Errors.forEach(function(error){
					var skuError = error.Sku + ': ' + error.ErrorMessages;
					errors.push(skuError);
				});
				req.flash('error', errors.join('<br>'));
				res.redirect('back');
			} else if(response.statusCode == 200){
				req.flash('success', 'SKUs Created successfully!');
				res.redirect('/');
			} else {
				req.flash('error', 'Possible error, unexpected response code: ' + response.statusCode);
				res.redirect('back');
			}
			console.log('statusCode:', response.statusCode); // Print the response status code if a response was received
  			console.log('body:', body); // Print the status response
		}
	});
});

module.exports = router;