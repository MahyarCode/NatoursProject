// import axios from './axios.min.js';
// import { loadStripe } from '@stripe/stripe-js';
// import { showAlert } from './alert.js';

// export const bookTour = async function (tourID) {
//     try {
//         // 1) get checkout session from API
//         const session = await axios(
//             `/api/v1/bookings/checkout-session/${tourID}`,
//         );
//         console.log(session);

//         // 2) Create checkout form + charge credit card
//         const stripe = loadStripe(
//             'pk_test_51Sw1InFPqfwGMFG90SWnVsifbG3aszEJbwbIYIhd6zLNAO6wsALJo4XGKt2W9WuAJY2ATANGgqfrKV47vklFai7q00dPZvUXLx',
//         );
//         await stripe.redirectToCheckout({
//             sessionId: session.data.session.id,
//         });
//     } catch (error) {
//         console.log(error);
//         showAlert('error', error);
//     }
// };
