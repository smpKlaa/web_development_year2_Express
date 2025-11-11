import express from 'express';
import multer from 'multer';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/userController.js';

const userRouter = express.Router();

const upload = multer({dest: '/uploads'});

userRouter.route('/').get(getUsers).post(upload.none(), postUser);
userRouter
  .route('/:id')
  .get(getUserById)
  .put(upload.none(), putUser)
  .delete(deleteUser);

export default userRouter;
