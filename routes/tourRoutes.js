const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.getAllTours);

router
    .route('/:id')
    .post(tourController.postTour)
    .get(tourController.getTour)
    .delete(tourController.deleteTour);

module.exports = router;