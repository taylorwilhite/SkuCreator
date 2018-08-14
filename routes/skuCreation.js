var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var request = require('request');
var Counter = require('../models/counter');
var Color = require('../models/color');
var colors = require('colors');

async function getNextUpc(seqName){
	var query = {"_id": seqName};
	var update = {$inc:{sequence_value:1}};
	var options = {new: true};

   	const counter = await Counter.findOneAndUpdate(query, update, options, function(err, counter){
	   	if(err){
	   		console.log(err);
	   	} else {
	   		return counter.sequence_value
	   	}
	}).exec();
   	return counter.sequence_value;
};

function picLink(linkUrl){
	linkUrl = linkUrl.replace(/www\.dropbox/, 'dl.dropboxusercontent');
	linkUrl = linkUrl.replace(/\?.*/, '');
	return linkUrl;
}

function wait1Sec(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
    	resolve(x);
    }, 2000);
  });
};

router.get('/', middleware.isLoggedIn, function(req, res){
	// Pull all colors and pass to view
	Color.find({}, (err, allColors) => {
		if(err){
			console.log(err);
		} else {
			res.render('index', {allColors: allColors});
		}
	});
});

router.post('/', middleware.isLoggedIn, async function(req, res){
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
		var skuColor = colors[colorIndex].colorName;
		var colorCode = colors[colorIndex].colorCode;
		var picture = picLink(colors[colorIndex].pictureLink);
		var fbColor = colors[colorIndex].fbColor;

		sizes.forEach( async function(size){
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
				"Sku":sku + colorCode + "-" + size,
				"Description":desc,
				"PartNumber":skuColor + " " + size,
				"Attributes":{  
			       "Color":skuColor,
			       "Size":size,
			       "FB Code":fbCode,
			       "FB Color Number":fbColor
			    },				
				"Classification":classification,
				"Supplier":"JuJu",
			    "Brand":brand,			    
			    "Cost":landedCost,
			    "VariationParentSku":sku,
			    "Pictures":[  
			       picture
			    ],			
			    "SupplierInfo":[  
			      {  
			         "SupplierName":supName,
			         "IsPrimary":true,
			         "IsActive":true,
			         "Cost":rawCost
			      }
			   ],
			   "Code":await getNextUpc('productupc')
			};
			newSKUs["Items"].push(newSize);
			var newSize = {};
		});
	};
	// Wait for previous function
	await wait1Sec(1);
	
	//Submit to SKUvault
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
			// logic for error/success flashes
			if(response.statusCode == 202){
				console.log('Submitted, response: ' + response.statusCode.toString().yellow + ' ' + body.Status.yellow);
				var errors = [];
				body.Errors.forEach(function(error){
					var skuError = error.Sku + ': ' + error.ErrorMessages;
					console.log('ERROR '.red + skuError); //log the error
					errors.push(skuError);
				});
				req.flash('error', errors.join('<br>'));
				res.redirect('back');
			} else if(response.statusCode == 200){
				console.log('Submitted, response: ' + response.statusCode.toString().green + ' ' + body.Status.green);
				req.flash('success', 'SKUs Created successfully!');
				res.redirect('/skuCreation');
			} else {
				console.log('Submitted, response: ' + response.statusCode.toString().red + ' ' + body.Status.red);
				body.Errors.forEach(function(error){
					console.log('ERROR '.red + error.Sku + ': ' + error.ErrorMessages)
				});
				req.flash('error', 'Possible error, unexpected response code: ' + response.statusCode);
				res.redirect('back');
			}
		}
	});
	} catch(error) {
		console.log(error);
	}
});

module.exports = router;