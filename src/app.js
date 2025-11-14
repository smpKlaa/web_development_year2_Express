import express from 'express';
import apiRouter from './api/index.js';
import cors from 'cors';
import {notFoundHandler, errorHandler} from './middlewares/errorHandlers.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use('/public', express.static('public'));

app.use('/uploads', express.static('uploads'));

app.use('/api/v1', apiRouter);

// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

export default app;
