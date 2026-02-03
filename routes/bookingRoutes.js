import express from 'express';
import * as book from '../Controllers/bookingController.js';
import * as auth from '../Controllers/authController.js';
const router = express.Router({ mergeParams: true });

router.get('/checkout-session/:tourID', auth.protect, book.getCheckoutSession);

export default router;
