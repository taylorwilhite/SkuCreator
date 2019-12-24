/* eslint no-loop-func: 0 */
const routeFunctions = require('./routeFunctions');

const { picLink, getNextUpc } = routeFunctions;
const plusSizes = ['P1X', 'P2X', 'P3X', 'OSP'];
const plusCheck = (size, reg, plus) => {
  if (plusSizes.includes(size)) {
    return plus;
  }
  return reg;
};


module.exports = async function skuCreation(body, tenant, user) {
  let upc = await getNextUpc('productupc');
  const sku = body.sku.parent;
  const desc = body.variantTitle;
  const {
    classification, brand, fbCode, hps, inseam, neckType,
  } = body;
  const colorSet = Object.entries(body.colorSet);
  const sizes = body.size;
  let content = '';
  let care = '';
  let construction = '';

  if (body.fbInfo) {
    content = body.fbInfo.find(attr => attr.Name === 'Content').Value;
    care = body.fbInfo.find(attr => attr.Name === 'Care Instruction').Value;
    construction = body.fbInfo.find(attr => attr.Name === 'Construction').Value;
  }

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
      const supp = Object.values(body.supp).map((supplier) => {
        return {
          SupplierName: supplier.Name,
          IsPrimary: false,
          IsActive: true,
          Cost: supplier.plusCost
            ? plusCheck(size, supplier.rawCost, supplier.plusCost) : supplier.rawCost,
        };
      });
      const supName = supp[0].SupplierName;
      const defCost = supp[0].Cost;
      supp[0].IsPrimary = true;

      const weight = body.plusWeight
        ? plusCheck(size, body.regWeight, body.plusWeight) : body.regWeight;
      // For loop for sizes

      const newSize = {
        Sku: `${sku}${colorCode}-${size}`,
        Description: desc,
        PartNumber: `${colorName} ${size}`,
        Attributes: {
          Color: colorName,
          Size: size,
          'FB Code': fbCode[0],
          'FB Color Number': fbColor[0],
          'FB Code 1': fbCode[0],
          'FB Color Number 1': fbColor[0],
          'FB Code 2': fbCode[1],
          'FB Color Number 2': fbColor[1],
          'FB Code 3': fbCode[2],
          'FB Color Number 3': fbColor[2],
          'FB Code 4': fbCode[3],
          'FB Color Number 4': fbColor[3],
          Inseam: inseam,
          HPS: hps,
          'Neck type': neckType,
          'Fabric Content': content,
          'Care Instructions': care,
          'Fabric Construction': construction,
        },
        Classification: classification,
        Supplier: supName,
        Brand: brand,
        Cost: defCost,
        Weight: weight,
        WeightUnit: 'oz',
        VariationParentSku: sku,
        Note: sku,
        Pictures: [
          picture,
        ],
        SupplierInfo: supp,
        Code: upc,
      };
      upc += 1;
      return newSKUs.Items.push(newSize);
    });
  }

  // const promiseSkus = await Promise.all(newSKUs.Items);
  return { skus: newSKUs, upc };
};
