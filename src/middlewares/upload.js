import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  sharp(req.file.path)
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

export {createThumbnail};
