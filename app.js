const express = require('express');

const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Using middlewares
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

//We should always specify version of api, so when we upgrade we can simply change to version 2.
//App Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour); --> Refactored to:

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handle all uncaught routes:
app.all('*', (req, res, next) => {
	// const err = new Error(`Can't find ${req.originalUrl} on this server. Are you sure this is the correct URL?`)
	// err.status = 'fail';
	// err.statusCode = 404;
	//When you pass ANYTHING into next, Express will automatically assume that it is an error. Then, it will ignore all of the middleware in our middleware stack and send the error to our global middleware handler.
	next(new AppError(`Can't find ${req.originalUrl} on this server. Are you sure this is the correct URL?`, 404));
});

//Creating global error handling middleware:

app.use(globalErrorHandler);

module.exports = app;