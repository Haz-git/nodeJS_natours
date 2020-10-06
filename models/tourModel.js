const mongoose = require('mongoose');

//Creating Schema for Tour
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A Tour must have a name!'],
		unique: true,
	},
	rating: {
		type: Number,
		default: 3.0,
	},
	price: {
		type: Number,
		required: [true, 'A Tour must have a price!'],
	},
});

//Creating Model from Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
