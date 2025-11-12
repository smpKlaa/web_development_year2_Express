import express from 'express';
// import multer from 'multer';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/userController.js';
import {authorizeUser} from '../../middlewares/authorizeUser.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const userRouter = express.Router();

// const upload = multer({dest: '/uploads'});

userRouter.route('/').get(getUsers).post(postUser);
userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, authorizeUser, putUser)
  .delete(authenticateToken, authorizeUser, deleteUser);

export default userRouter;
