const xl = require('excel4node');

const makeExcel = (body) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Worksheet');
  const style = wb.createStyle({
    font: {
      color: 'FFFFFF',
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '808080',
      fgColor: '808080',
    },
    border: {
      right: {
        style: 'double',
      },
      outline: true,
    },
  });
  ws.cell(1, 1).string('Reference Image').style(style);
  ws.cell(1, 2).string('Brand').style(style);
  ws.cell(1, 3).string('Vendor Sku (REQUIRED)').style(style);
  ws.cell(1, 4).string('zulily Product ID').style(style);
  ws.cell(1, 5).string('UPC').style(style);
  ws.cell(1, 6).string('Product Name (REQUIRED)').style(style);
  ws.cell(1, 7).string('Size').style(style);
  ws.cell(1, 8).string('Color').style(style);
  ws.cell(1, 9).string('Qty (REQUIRED)').style(style);
  ws.cell(1, 10).string('Country of Origin (REQUIRED)').style(style);
  ws.cell(1, 11).string('Re-used Style').style(style);

  body.Products.forEach((item, i) => {
    const {
      Brand, Sku, Code, Description,
    } = item;
    const image = item.Pictures[0];
    const size = item.Attributes.find(obj => obj.Name === 'Size').Value;
    const color = item.Attributes.find(obj => obj.Name === 'Color').Value;
    const rowOffset = 2;
    ws.cell(rowOffset + i, 1).string(image);
    ws.cell(rowOffset + i, 2).string(Brand);
    ws.cell(rowOffset + i, 3).string(Sku);
    ws.cell(rowOffset + i, 4).string('');
    ws.cell(rowOffset + i, 5).string(Code);
    ws.cell(rowOffset + i, 6).string(Description);
    ws.cell(rowOffset + i, 7).string(size);
    ws.cell(rowOffset + i, 8).string(color);
    ws.cell(rowOffset + i, 9).string('');
    ws.cell(rowOffset + i, 10).string('China');
    ws.cell(rowOffset + i, 11).string('');
  });

  return wb;
};

module.exports = makeExcel;
