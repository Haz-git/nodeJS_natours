const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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



exports.getAllTours = async (req, res) => {
    try {
        //Create new obj with all key-value pairs as req.query.
        // const queryObj = {
        //     ...req.query
        // }
        // //Create an array of keys we want to exclude:
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // //loop through array and delete keys from new query obj.
        // excludedFields.forEach(el => delete queryObj[el]);

        // //Advanced Filtering: lte/gte:
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/(\bgte|gt|lte|lt\b)/g, match => `$${match}`);

        // // We cannot use await as follows:
        // // const tours = await Tour.find(queryObj);
        // // This is because we want to build the query object, we cannot chain other methods to query object when we await it--this is because our query object is executed immediately due to await.
        // let query = Tour.find(JSON.parse(queryStr));

        //Implementing Sorting:
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else {
        //     //Default sort if no sort query specified.
        //     query = query.sort('-createdAt');
        // }

        //Limiting Fields:
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v'); //Exclude __v
        // }

        //Pagination:
        // const page = req.query.page * 1 || 1; //convert string to num || defines a default value.
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('This page does not exist!');
        // }

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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        //findById is a helper function for finding Mongo's '_id'.

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Failed',
            message: err,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        //Status code 204 for 'no content'
        res.status(204).json({
            status: 'Success',
            data: null, //This data is null cause no new information on delete.
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
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

    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
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
                        $sum: 1
                    }
                }
            }
        ]);

        res.status(200).json({
            status: 'Success',
            data: {
                plan,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
}