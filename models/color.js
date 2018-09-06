const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  color: String,
  colorCode: String,
});

module.exports = mongoose.model('Color', colorSchema);
