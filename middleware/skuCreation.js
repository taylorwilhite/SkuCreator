/* eslint no-loop-func: 0 */
const routeFunctions = require('./routeFunctions');

const { picLink, getNextUpc } = routeFunctions;


module.exports = async function skuCreation(body, tenant, user) {
  let upc = await getNextUpc('productupc');
  const sku = body.sku.parent;
  const desc = body.variantTitle;
  const {
    classification, brand, fbCode, hps, inseam, weight,
  } = body;
  const supName = body.supp.Name;
  const colorSet = Object.entries(body.colorSet);
  const sizes = body.size;
  const regRaw = body.rawCost;
  const plusRaw = body.plus.rawCost;

  // Create Empty object to push SKUs into
  const newSKUs = {
    Items: [],
    TenantToken: tenant,
    UserToken: user,
  };

  // Format Correctly
  for (let colorIndex = 0; colorIndex < colorSet.length; colorIndex += 1) {
    const { colorName, colorCode, fbColor } = colorSet[colorIndex][1];
    const picture = picLink(colorSet[colorIndex][1].pictureLink);

    sizes.map((size) => {
      let landedCost = '';
      let rawCost = '';
      // For loop for sizes
      if (size === 'P1X' || size === 'P2X' || size === 'P3X') {
        landedCost = plusRaw;
        rawCost = plusRaw;
      } else {
        landedCost = regRaw;
        rawCost = regRaw;
      }

      const newSize = {
        Sku: `${sku}${colorCode}-${size}`,
        Description: desc,
        PartNumber: `${colorName} ${size}`,
        Attributes: {
          Color: colorName,
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
        Weight: weight,
        WeightUnit: 'oz',
        VariationParentSku: sku,
        Note: sku,
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
        Code: upc,
      };
      upc += 1;
      return newSKUs.Items.push(newSize);
    });
  }

  // const promiseSkus = await Promise.all(newSKUs.Items);
  return { skus: newSKUs, upc };
};
