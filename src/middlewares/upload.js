import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
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

const saveImageToDisk = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
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

export {createThumbnail, saveImageToDisk};
