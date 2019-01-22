const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema({
  name: String,
  isEnabled: Boolean,
  attributes: [{ name: String, values: [String] }], // This is for later features
});

module.exports = mongoose.model('Classification', classificationSchema);
