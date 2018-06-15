var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var request = require('request');
var Counter = require('../models/counter');


async function getNextUpc(seqName){
	var query = {"_id": seqName};
	var update = {$inc:{sequence_value:1}};
	var options = {new: true};

   	const counter = await Counter.findOneAndUpdate(query, update, options, function(err, counter){
	   	if(err){
	   		console.log(err);
	   	} else {
	   		console.log(counter.sequence_value); // gives updated number
	   		return counter.sequence_value // gives undefined
	   	}
	}).exec();
   	return counter.sequence_value;
};

router.get('/', middleware.isLoggedIn, function(req, res){
	res.render('index');
});

router.post('/', async function(req, res){
	try{
	// Get info from body
	var sku = req.body.sku.parent;
	var desc = req.body.variantTitle;
	var classification = req.body.classification;
	var brand = req.body.brand;
	var supName = req.body.supp.Name;
	var supPrim = req.body.supp.Primary;
	var colors = req.body.colorSet;
	var sizes = req.body.size;
	var regLanded = req.body.landedCost;
	var regRaw = req.body.supp.Cost;
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
	for (var colorIndex in colors) {
		var skuColor = colors[colorIndex].color;
		var colorCode = colors[colorIndex].colorCode;
		var picture = colors[colorIndex].pictureLink;

		sizes.forEach( async function(size){
			var landedCost = ''
			var rawCost = ''
			var newUpc = await getNextUpc('productupc');
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
				"Sku":sku + colorCode + "-" + size,
				"Description":desc,
				"Code":newUpc,
				"Classification":classification,
				"Supplier":"JuJu",
			    "Brand":brand,
			    "PartNumber":skuColor + " " + size,
			    "Cost":landedCost,
			    "VariationParentSku":sku,
			    "Pictures":[  
			       picture
			    ],
			    "Attributes":{  
			       "Color":skuColor,
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
	};
	
	setTimeout(function(){console.log(newSKUs)}, 5000);
	// var newSkuJSON = JSON.stringify(newSKUs);
	//Submit to SKUvault
	setTimeout(request(
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
			// logic for error/success flashes
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
	}), 10000);
	} catch(error) {
		console.log(error);
	}
});

module.exports = router;