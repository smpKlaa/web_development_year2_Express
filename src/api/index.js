import express from 'express';
import catRouter from './routes/catRouter.js';
import userRouter from './routes/userRouter.js';

const router = express.Router();

router.use('/cat', catRouter);
router.use('/user', userRouter);

export default router;
