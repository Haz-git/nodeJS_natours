const mongoose = require('mongoose');

//Creating Schema for Tour
const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A Tour must have a name!'],
		unique: true,
	},
	duration: {
		type: Number,
		required: [true, 'A Tour must have a duration!']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A Tour must have a group size!']
	},
	difficulty: {
		type: String,
		required: [true, 'A Tour must have a difficulty']
	},
	ratingsAverage: {
		type: Number,
		default: 3.0,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, 'A Tour must have a price!'],
	},
	priceDiscount: Number,
	summary: {
		type: String,
		trim: true,
		required: [true, 'A Tour must have a summary'],
	},
	description: {
		type: String,
		trim: true,
	},
	imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image'],
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	startDate: [Date],
});
//Trim cuts all the whitespace.

//Creating Model from Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;