const Tour = require('../models/tourModel');

//Not needed placeholder dummy database
// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
    try {
        //Create new obj with all key-value pairs as req.query.
        const queryObj = {
            ...req.query
        }
        //Create an array of keys we want to exclude:
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        //loop through array and delete keys from new query obj.
        excludedFields.forEach(el => delete queryObj[el]);

        //Advanced Filtering: lte/gte:
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/(\bgte|gt|lte|lt\b)/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));


        // We cannot use await as follows:
        // const tours = await Tour.find(queryObj);
        // This is because we want to build the query object, we cannot chain other methods to query object when we await it--this is because our query object is executed immediately due to await.
        const query = Tour.find(JSON.parse(queryStr));

        //Execute query
        const tours = await query;

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