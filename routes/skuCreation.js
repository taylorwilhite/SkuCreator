const express = require('express');
const colors = require('colors');
const request = require('request');
const middleware = require('../middleware');
const Counter = require('../models/counter');
const Color = require('../models/color');
const routeFunctions = require('../middleware/routeFunctions');

const { picLink } = routeFunctions;

const router = express.Router();

async function getNextUpc(seqName) {
  const query = { _id: seqName };
  const update = { $inc: { sequence_value: 1 } };
  const options = { new: true };

  const counter = await Counter.findOneAndUpdate(query, update, options, (err, returnCounter) => {
    if (err) {
      return console.log(err);
    }
    return returnCounter.sequence_value;
  }).exec();
  return counter.sequence_value;
}

function wait1Sec(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

router.get('/', middleware.isLoggedIn, (req, res) => {
  // Pull all colors and pass to view
  Color.find({}, (err, allColors) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { allColors: allColors });
    }
  });
});

router.post('/', middleware.isLoggedIn, async (req, res) => {
  try {
    // Get info from body
    const sku = req.body.sku.parent;
    const desc = req.body.variantTitle;
    const classification = req.body.classification;
    const brand = req.body.brand;
    const supName = req.body.supp.Name;
    const supPrim = req.body.supp.Primary;
    let colorSet = Object.entries(req.body.colorSet);
    const sizes = req.body.size;
    const regLanded = req.body.landedCost;
    const regRaw = req.body.supp.Cost;
    const fbCode = req.body.fbCode;
    const plusLanded = req.body.plus.landedCost;
    const plusRaw = req.body.plus.rawCost;
    const hps = req.body.hps;
    const inseam = req.body.inseam;

    // Create Empty object to push SKUs into
    const newSKUs = {
      Items: [],
      TenantToken: req.session.TenantToken,
      UserToken: req.session.UserToken,
    };

    // Format Correctly
    for (let colorIndex = 0; colorIndex < colorSet.length; colorIndex += 1) {
      const skuColor = colorSet[colorIndex][1].colorName;
      const colorCode = colorSet[colorIndex][1].colorCode;
      const picture = picLink(colorSet[colorIndex][1].pictureLink);
      const fbColor = colorSet[colorIndex][1].fbColor;

      sizes.forEach(async (size) => {
        let landedCost = '';
        let rawCost = '';
        // For loop for sizes
        if (size === 'P1X' || size === 'P2X' || size === 'P3X') {
          landedCost = plusLanded;
          rawCost = plusRaw;
        } else {
          landedCost = regLanded;
          rawCost = regRaw;
        }

        let newSize = {
          Sku: sku + colorCode + "-" + size,
          Description: desc,
          PartNumber: skuColor + " " + size,
          Attributes: {
            Color: skuColor,
            Size: size,
            'FB Code': fbCode,
            'FB Color Number': fbColor,
            Inseam: inseam,
            HPS: hps,
          },
          Classification: classification,
          Supplier: supName,
          Brand: brand,
          Cost: landedCost,
          VariationParentSku: sku,
          Pictures: [
            picture,
          ],
          SupplierInfo: [
            {
              SupplierName: supName,
              IsPrimary: true,
              IsActive: true,
              Cost: rawCost,
            },
          ],
          Code: await getNextUpc('productupc'),
        };
        newSKUs.Items.push(newSize);
        newSize = {};
      });
    }
    // Wait for previous function
    await wait1Sec(1);

    // Submit to SKUvault
    request(
      {
        method: 'POST',
        url: 'https://app.skuvault.com/api/products/createProducts',
        headers: [{ 'Content-Type': 'application/json', Accept: 'application/json' }],
        json: true,
        body: newSKUs,
      }, (err, response, body) => {
        if (err) {
          console.log(err);
          req.flash('error', err);
          res.redirect('back');
        } else if (response.statusCode === 202) {
          // logic for error/success flashes
          console.log('Submitted, response: ' + response.statusCode.toString().yellow + ' ' + body.Status.yellow);
          const errors = [];
          body.Errors.forEach((error) => {
            const skuError = error.Sku + ': ' + error.ErrorMessages;
            console.log('ERROR '.red + skuError); // log the error
            errors.push(skuError);
          });
          req.flash('error', errors.join('<br>'));
          res.redirect('back');
        } else if (response.statusCode === 200) {
          console.log('Submitted, response: ' + response.statusCode.toString().green + ' ' + body.Status.green);
          req.flash('success', 'SKUs Created successfully!');
          res.redirect('/skuCreation');
        } else {
          console.log('Submitted, response: ' + response.statusCode.toString().red + ' ' + body.Status.red);
          body.Errors.forEach((error) => {
            console.log('ERROR '.red + error.Sku + ': ' + error.ErrorMessages);
          });
          req.flash('error', 'Possible error, unexpected response code: ' + response.statusCode);
          res.redirect('back');
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
