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
};
