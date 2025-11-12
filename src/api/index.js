import express from 'express';
import catRouter from './routes/catRouter.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';

const router = express.Router();

router.use('/cat', catRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
