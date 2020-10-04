const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

//Using middleware
app.use(express.json());

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: 'Hello from Express!',app: 'Natours' });
// })

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint');
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//We should always specify version of api, so when we upgrade we can simply change to version 2.
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'Success',
        results: tours.length,
        data: {
            tours
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
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
})

app.listen(port, () => {
    console.log(`App is now running on port ${port}`);
});