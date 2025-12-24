import express from 'express';
import * as user from '../Controllers/userController.js';
import * as authentication from '../Controllers/authController.js';

const router = express.Router();

router.post('/signup', authentication.signup);
router.post('/login', authentication.login);

router.route('/').get(user.getAllUsers).post(user.createUser);

router
    .route('/:id')
    .get(user.getUser)
    .patch(user.updateUser)
    .delete(user.deleteUser);

export default router;
