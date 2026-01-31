import express from 'express';
import * as view from '../Controllers/viewController.js';
import * as auth from '../Controllers/authController.js';

const router = express.Router();

router.get('/overview', auth.isLoggedIn, view.getOverview);
router.get('/tour/:slug', auth.isLoggedIn, view.getTour);
router.get('/login', auth.isLoggedIn, view.goToLoginPage);
router.get('/me', auth.protect, view.getAccountProfile);

export default router;
