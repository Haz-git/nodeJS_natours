/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Creating Schema for Tour
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must have a name!'],
            unique: true,
            maxlength: [
                40,
                'A Tour name must have less or equal than 40 characters!',
            ],
            minlength: [
                3,
                'A Tour name must have more or equal to 3 characters!',
            ],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain characters',
            // ],
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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Please only write easy, medium, or difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 3.0,
            min: 1,
            max: 5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A Tour must have a price!'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                    //If this returns true, then no validation error. 'This' only points to current doc on NEW document creation.
                },
                message: 'Discount Price should be below Regular Price',
            },
        },
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
