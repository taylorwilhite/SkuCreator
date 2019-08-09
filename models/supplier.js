const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: String,
  isEnabled: Boolean,
});

module.exports = mongoose.model('Supplier', supplierSchema);
