import express from 'express';
import * as tour from '../Controllers/tourController.js';
import * as auth from '../Controllers/authController.js';

const router = express.Router();

// creating a middleware that shows top 5 cheapest tours
router.route('/top-5-cheap').get(tour.alias, tour.getAllTours);

router.route('/tour-stats').get(tour.getTourStats);
router.route('/monthly-plan/:year').get(tour.getMonthlyPlan);

router.route('/').get(auth.protect, tour.getAllTours).post(tour.createTour);

// //DESC the following middleware will check the id first (if we have the id param)
// router.param('id', tour.checkID);

router
    .route('/:id')
    .get(tour.getSingleTour)
    .patch(tour.updateTour)
    .delete(
        auth.protect,
        auth.restrictTo('admin', 'lead-guide'),
        tour.deleteTour,
    );

export default router;
