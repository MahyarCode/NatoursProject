import express from 'express';
import * as user from '../Controllers/userController.js';

const router = express.Router();

router
    .route('/')
    .get(user.getAllUsers)
    .post(user.createUser);

router
    .route('/:id')
    .get(user.getUser)
    .patch(user.updateUser)
    .delete(user.deleteUser);

export default router;
