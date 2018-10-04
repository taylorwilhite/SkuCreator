const xl = require('excel4node');

const makeExcel = (body) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Worksheet');
  ws.cell(1, 1).string('Referenc Image');
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

  body.Products.forEach((item) => {
    const { Brand, Sku, Code, Description } = item;
  });
};

export default makeExcel;
