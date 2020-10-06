const Tour = require('../models/tourModel');

//Not needed placeholder dummy database
// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

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

exports.deleteTour = (req, res) => {
    //Status code 204 for 'no content'
    res.status(204).json({
        status: 'Success',
        data: null, //This data is null cause no new information on delete.
    });
};