import express from 'express';
import apiRouter from './api/index.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use('/public', express.static('public'));

app.use('/uploads', express.static('uploads'));

app.use('/api/v1', apiRouter);

export default app;
