const express = require('express');
// eslint-disable-next-line prettier/prettier
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);
//We create a middleware (aliasTopTours) that manipulates the request object to simulate a query string with all the parameters necessary to get the top 5 tours.

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .patch(tourController.updateTour)
    .get(tourController.getTour)
    .delete(tourController.deleteTour);

module.exports = router;