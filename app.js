const express = require('express');
const fs = require('fs');
const { pathToFileURL } = require('url');
const app = express();
const port = process.env.PORT || 3000; // for better approch, use environment valiable to ensure if 3000 is busy then server can assign any free port , it is neccissary for production

//Using middleware
app.use(express.json());

//Reading files
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//ALL ROUTE HANDLERS

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'Success',
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTour = (req, res) => {
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

const postTour = (req, res) => {
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

const patchTour = (req, res) => {
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

const deleteTour = (req, res) => {
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


//We should always specify version of api, so when we upgrade we can simply change to version 2.
//App Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour); --> Refactored to:

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(getAllTours);

app
    .route('/api/v1/tours/:id')
    .post(postTour)
    .get(getTour)
    .delete(deleteTour)

app.listen(port, () => {
    console.log(`App is now running on port ${port}`);
});
