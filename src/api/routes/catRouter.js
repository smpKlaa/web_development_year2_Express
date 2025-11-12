import express from 'express';
import multer from 'multer';
// import path from 'path';
import {createThumbnail, saveImageToDisk} from '../../middlewares/upload.js';
import {
  getCats,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatByOwnerId,
} from '../controllers/catController.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {authorizeCatOwner} from '../../middlewares/authorizeCatOwner.js';

const catRouter = express.Router();

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   },
// });

const upload = multer({storage});

catRouter
  .route('/')
  .get(getCats)
  .post(
    authenticateToken,
    upload.single('file'),
    authorizeCatOwner,
    saveImageToDisk,
    createThumbnail,
    postCat
  );
catRouter
  .route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    upload.single('file'),
    authorizeCatOwner,
    saveImageToDisk,
    createThumbnail,
    putCat
  )
  .delete(authenticateToken, authorizeCatOwner, deleteCat);
catRouter.route('/:ownerId').get(getCatByOwnerId);

export default catRouter;
