import express from 'express';
import * as user from '../Controllers/userController.js';
import * as auth from '../Controllers/authController.js';

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/forgotPassword', auth.forgetPassword);
router.patch('/resetPassword/:token', auth.resetPassword);

router.patch('/updatePassword', auth.protect, auth.updatePassword);
router.patch(
    '/updateMe',
    auth.protect,
    user.uploadUserPhoto,
    user.resizeUserPhoto,
    user.updateMe,
);

router.delete('/deleteMe', auth.protect, user.deleteMe);

router.route('/').get(user.getAllUsers).post(user.createUser);

router
    .route('/:id')
    .get(user.getUser)
    .patch(user.updateUser)
    .delete(user.deleteUser);

export default router;
