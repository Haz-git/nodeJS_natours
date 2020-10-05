const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'Success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

exports.getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1; //Convert string to number 
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    });
}

exports.postTour = (req, res) => {
    console.log(req.body);
    //req.body availiable on request because we used middleware.
    const newId = tours[tours.length -1].id + 1;
    const newTour = Object.assign({
        id: newId
    }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour
            }
        })
    })
}

exports.patchTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'Success',
        data: {
            tour: 'Updated Tour here...'
        }
    });
}

exports.deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    //Status code 204 for 'no content'
    res.status(204).json({
        status: 'Success',
        data: null //This data is null cause no new information on delete.
    });
}