import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getCats,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/catController.js';

const catRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({storage});

catRouter.route('/').get(getCats).post(upload.single('photo'), postCat);
catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
