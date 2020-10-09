const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//Not needed placeholder dummy database
// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTours = (req, res, next) => {
    //In this middleware, we alter the request object before it heads to getAllTours:
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}



exports.getAllTours = catchAsync(async (req, res) => {

    //Execute query
    //Created new features class -- passing in query object and query string:
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

    const tours = await features.query;

    //Send Response

    res.status(200).json({
        status: 'Success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id);
    //findById is a helper function for finding Mongo's '_id'.

    if (!tour) {
        return next(new AppError('No Tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour,
        },
    });

});



exports.createTour = catchAsync(async (req, res, next) => {
    res.status(201).json({
        status: 'Success',
        data: {
            tour: newTour,
        },
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError('No Tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour,
        },
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError('No Tour found with that ID', 404));
    }

    //Status code 204 for 'no content'
    res.status(204).json({
        status: 'Success',
        data: null, //This data is null cause no new information on delete.
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    //Pass in an array of 'stages'
    //Each object in the array represent the 'stage'
    const stats = await Tour.aggregate([{
            $match: {
                ratingsAverage: {
                    $gte: 4.5,
                }
            }
        },
        {
            $group: {
                //_id = null because we want one single group.
                _id: '$difficulty',
                numTours: {
                    $sum: 1,
                },
                numRatings: {
                    $sum: '$ratingsQuantity',
                },
                avgRating: {
                    $avg: '$ratingsAverage',
                },
                avgPrice: {
                    $avg: '$price',
                },
                minPrice: {
                    $min: '$price',
                },
                maxPrice: {
                    $max: '$price',
                },
            }
        },
    ]);

    res.status(200).json({
        status: 'Success',
        data: {
            stats,
        },
    });

})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([{
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: {
                    $month: '$startDates',
                },
                numTourStarts: {
                    $sum: 1,
                },
                tours: {
                    $push: '$name',
                }
            }
        },
        {
            $addFields: {
                month: '$_id',
            }
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                numTourStarts: -1,
            },
        },
    ]);

    res.status(200).json({
        status: 'Success',
        data: {
            plan,
        },
    });
});