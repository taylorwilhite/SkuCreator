const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  material: String,
  care: String,
});

module.exports = mongoose.model('Material', materialSchema);
