const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema({
  name: String,
  isEnabled: Boolean,
});

module.exports = mongoose.model('Classification', classificationSchema);
