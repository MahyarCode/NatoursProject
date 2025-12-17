import express from 'express';
import * as tour from '../Controllers/tourController.js';

const router = express.Router();

router
    .route('/')
    .get(tour.getAllTours)
    .post(tour.createTour);

router
    .route('/:id')
    .get(tour.getSingleTour)
    .patch(tour.updateTour)
    .delete(tour.deleteTour);

export default router;
