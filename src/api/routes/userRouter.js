import express from 'express';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares/errorHandlers.js';
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

userRouter
  .route('/')
  .get(getUsers)
  .post(
    body('name').trim().notEmpty().isLength({min: 2, max: 50}).isAlpha(),
    body('username')
      .trim()
      .notEmpty()
      .isLength({min: 2, max: 50})
      .isAlphanumeric(),
    body('email')
      .trim()
      .notEmpty()
      .isLength({min: 2, max: 50})
      .isEmail()
      .withMessage('must be valid email address.'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({min: 2})
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage(
        'password must have 8 characters, lowercase letter, highercase letter, and a number.'
      ),
    body('role')
      .isIn(['user', 'admin'])
      .withMessage("role must be either 'user' or 'admin'"),
    validationErrors,
    postUser
  );
userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, authorizeUser, putUser)
  .delete(authenticateToken, authorizeUser, deleteUser);

export default userRouter;
