import express from 'express';
import {getMe, postLogin} from '../controllers/authController.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const authRouter = express.Router();

authRouter.route('/me').get(authenticateToken, getMe);
authRouter.route('/login').post(postLogin);

export default authRouter;
