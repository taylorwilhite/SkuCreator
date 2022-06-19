/* eslint no-loop-func: 0 */
const routeFunctions = require('./routeFunctions');

const { picLink, getNextUpc } = routeFunctions;
const plusSizes = ['1X', '2X', '3X', 'OS'];
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
    classification,
    brand,
    fbCode,
    trimCode,
    hps,
    inseam,
    neckType,
    department,
    itemClass,
    subClass,
    sleeve,
    sleeveSub,
    colorBucket,
    fabric,
    fabricBucket,
    details,
    fit,
    collection,
    cto,
    season,
  } = body;
  const colorSet = Object.entries(body.colorSet);
  const sizes = body.size;
  let content = '';
  let construction = '';

  if (body.fbInfo) {
    content = body.fbInfo.find((attr) => attr.Name === 'Content').Value;
    construction = body.fbInfo.find(
      (attr) => attr.Name === 'Construction'
    ).Value;
  }

  // Create Empty object to push SKUs into
  const newSKUs = {
    Items: [],
    TenantToken: tenant,
    UserToken: user,
  };

  // Format Correctly
  for (let colorIndex = 0; colorIndex < colorSet.length; colorIndex += 1) {
    const { colorName, colorCode, fbColor, trimColor } =
      colorSet[colorIndex][1];
    const picture = picLink(colorSet[colorIndex][1].pictureLink);

    sizes.map((size) => {
      const supp = Object.values(body.supp).map((supplier) => {
        return {
          SupplierName: supplier.Name,
          IsPrimary: false,
          IsActive: true,
          Cost: supplier.plusCost
            ? plusCheck(size, supplier.rawCost, supplier.plusCost)
            : supplier.rawCost,
        };
      });
      const supName = supp[0].SupplierName;
      supp[0].IsPrimary = true;

      const weight = body.plusWeight
        ? plusCheck(size, body.regWeight, body.plusWeight)
        : body.regWeight;
      const addition = Math.round(weight * 0.03 * 6.75 * 100) / 100;
      const defCost = parseFloat(supp[0].Cost) + addition;
      // For loop for sizes

      const newSize = {
        Sku: `${sku}${colorCode}-${size}`,
        Description: desc,
        PartNumber: `${colorName} ${size}`,
        Attributes: {
          Color: colorName,
          Size: size,
          'Parent SKU w/ color': `${sku}${colorCode}`,
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
          Trim: trimCode[0],
          'Trim Color': trimColor[0],
          'Trim 1': trimCode[0],
          'Trim Color 1': trimColor[0],
          'Trim 2': trimCode[1],
          'Trim Color 2': trimColor[1],
          'Trim 3': trimCode[2],
          'Trim Color 3': trimColor[2],
          'Trim 4': trimCode[3],
          'Trim Color 4': trimColor[3],
          'Trim 5': trimCode[4],
          'Trim Color 5': trimColor[4],
          'Trim 6': trimCode[5],
          'Trim Color 6': trimColor[5],
          Inseam: inseam,
          HPS: hps,
          'Neck type': neckType,
          'Fabric Content': content,
          'Fabric Construction': construction,
          Department: department,
          Class: itemClass,
          'Sub Class': subClass,
          'Sleeve Type': sleeve,
          'Sleeve Sub Class': sleeveSub,
          'Color Bucket': colorBucket,
          Fabric: fabric,
          'Fabric Bucket': fabricBucket,
          Details: details,
          'Fit Type': fit,
          Collection: collection,
          CTO: !!cto ? 'Yes' : '',
          Season: season,
        },
        Classification: classification,
        Supplier: supName,
        Brand: brand,
        Cost: defCost,
        Weight: weight,
        WeightUnit: 'oz',
        VariationParentSku: sku,
        Note: sku,
        Pictures: [picture],
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
