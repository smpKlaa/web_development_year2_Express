import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// File validation and save uploaded file to memory.
const validateUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: (req, file, cb) => {
    // only allow images and videos
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

const saveImageToDisk = async (req, res, next) => {
  if (req.method === 'POST') {
    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }
  }
  if (req.method === 'PUT' && !req.file) {
    return next();
  }
  const ext = path.extname(req.file.originalname);
  const name = path.basename(req.file.originalname, ext);
  const filename = `${name}-${Date.now()}${ext}`;
  const filepath = `uploads/${filename}`;
  req.file.filename = filename;
  req.file.path = filepath;

  fs.writeFile(filepath, req.file.buffer, (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
};

const createThumbnail = async (req, res, next) => {
  if (req.method === 'POST') {
    if (!req.file.buffer) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }
  }
  if (req.method === 'PUT' && !req.file) {
    return next();
  }

  await sharp(req.file.buffer)
    .resize(160, 160)
    .toFormat('jpeg')
    .toBuffer()
    .then((data) => {
      const name = path.basename(
        req.file.filename,
        path.extname(req.file.filename)
      );
      fs.writeFile(`uploads/${name}_thumb.jpeg`, data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  next();
};

export {validateUpload, createThumbnail, saveImageToDisk};
