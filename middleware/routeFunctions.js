const Counter = require('../models/counter');

module.exports = {
  getFabricBook: (body) => {
    const { material, number, title, supplier, brand, weight, image, care } = body;

    const newBook = {
      Sku: `${number}-FB`,
      Classification: '(A7) Material- General',
      Supplier: supplier,
      Brand: brand,
      Description: title,
      Code: number,
      Weight: weight,
      WeightUnit: 'oz',
      Pictures: [
        image,
      ],
      Attributes: {
        Content: material,
        'Care Instruction': care,
      },
      SupplierInfo: [
        {
          SupplierName: supplier,
          IsActive: true,
          IsPrimary: true,
        },
      ],
    };

    return newBook;
  },

  picLink: (changeLink) => {
    let linkUrl = changeLink;
    linkUrl = linkUrl.replace(/www\.dropbox/, 'dl.dropboxusercontent');
    linkUrl = linkUrl.replace(/\?.*/, '');
    return linkUrl;
  },

  getNextUpc: async (seqName) => {
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
  },
};
