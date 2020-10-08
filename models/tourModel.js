/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');

//Creating Schema for Tour
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must have a name!'],
            unique: true,
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A Tour must have a duration!'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A Tour must have a group size!'],
        },
        difficulty: {
            type: String,
            required: [true, 'A Tour must have a difficulty'],
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
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);
//Trim cuts all the whitespace.

//Virtual property

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//Document Middleware: runs before .save() and .create();
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.post('save', function(doc,next)=> {
// 	console.log(doc);
// 	next();
// })

//Query middleware:
tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTour: {
            $ne: true,
        },
    });
    next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true,
            },
        },
    });
    next();
});

//Creating Model from Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
