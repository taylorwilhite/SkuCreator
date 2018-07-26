var mongoose = require('mongoose');

var colorSchema = new mongoose.Schema({
	color:String,
	colorCode:String
});

module.exports = mongoose.model('Color', colorSchema);