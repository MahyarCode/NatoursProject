import Tour from '../models/tourModel.js';
import { catchAsync } from '../utilities/catchAsyncError.js';
import AppError from '../utilities/appError.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.tourID);

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/overview`,
        cancel_url: `${req.protocol}://${req.get('host')}/overview/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100, // cents
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
                quantity: 1,
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        session,
    });
});
