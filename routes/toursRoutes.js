import express from 'express';
import * as tour from '../Controllers/tourController.js';

const router = express.Router();

router
    .route('/')
    .get(tour.getAllTours)
    .post(tour.createTour); //DESC this way, we can put multiple middleware for a single operation.

// //DESC the following middleware will check the id first (if we have the id param)
// router.param('id', tour.checkID);

router
    .route('/:id')
    .get(tour.getSingleTour)
    .patch(tour.updateTour)
    .delete(tour.deleteTour);

export default router;
