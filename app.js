const express = require('express');
const app = express();
const port = 3000;


// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: 'Hello from Express!',app: 'Natours' });
// })

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint');
// })

app.get('/api/v1/tours')

app.listen(port, () => {
    console.log(`App is now running on port ${port}`);
});