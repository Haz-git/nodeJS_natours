const Tour = require('../models/tourModel');

//Not needed placeholder dummy database
// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = (req, res) => {
	console.log(req.requestTime);

	res.status(200).json({
		status: 'Success',
		requestedAt: req.requestTime,
		// results: tours.length,
		// data: {
		// 	tours,
		// },
	});
};

exports.getTour = (req, res) => {
	const id = req.params.id * 1;
	// const tour = tours.find((el) => el.id === id);

	// res.status(200).json({
	// 	status: 'Success',
	// 	data: {
	// 		tour,
	// 	},
	// });
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

exports.updateTour = (req, res) => {
	res.status(200).json({
		status: 'Success',
		data: {
			tour: 'Updated Tour here...',
		},
	});
};

exports.deleteTour = (req, res) => {
	//Status code 204 for 'no content'
	res.status(204).json({
		status: 'Success',
		data: null, //This data is null cause no new information on delete.
	});
};
