const xl = require('excel4node');

const makeExcel = (body) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Worksheet');
  ws.cell(1, 1).string('Reference Image');
  ws.cell(1, 2).string('Brand');
  ws.cell(1, 3).string('Vendor Sku (REQUIRED)');
  ws.cell(1, 4).string('zulily Product ID');
  ws.cell(1, 5).string('UPC');
  ws.cell(1, 6).string('Product Name (REQUIRED)');
  ws.cell(1, 7).string('Size');
  ws.cell(1, 8).string('Color');
  ws.cell(1, 9).string('Qty (REQUIRED)');
  ws.cell(1, 10).string('Country of Origin (REQUIRED)');
  ws.cell(1, 11).string('Re-used Style');

  console.log(body);

  body.Products.forEach((item, i) => {
    console.log(item);
    const { Brand, Sku, Code, Description } = item;
    const image = item.Pictures[0];
    const { Size, Color } = item.Attributes;
    const rowOffset = 2;
    ws.cell(rowOffset + i, 1).string(image);
    ws.cell(rowOffset + i, 2).string(Brand);
    ws.cell(rowOffset + i, 3).string(Sku);
    ws.cell(rowOffset + i, 4).string('');
    ws.cell(rowOffset + i, 5).string(Code);
    ws.cell(rowOffset + i, 6).string(Description);
    ws.cell(rowOffset + i, 7).string(Size);
    ws.cell(rowOffset + i, 8).string(Color);
    ws.cell(rowOffset + i, 9).string('');
    ws.cell(rowOffset + i, 10).string('China');
    ws.cell(rowOffset + i, 11).string('');
  });

  return wb;
};

module.exports = makeExcel;
