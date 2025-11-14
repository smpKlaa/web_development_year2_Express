import {
  listAllCats,
  findCatById,
  addCat,
  replaceCat,
  removeCat,
  findCatsByOwnerId,
} from '../models/catModel.js';
import 'dotenv/config.js';
import process from 'process';

const getCats = async (req, res, next) => {
  console.log('GET all cats.');
  const result = await listAllCats();

  if (result.error) {
    return next(new Error(result.error));
  }
  res.json(result.map(serializeCat));
};

const getCatById = async (req, res, next) => {
  console.log('GET cat by id.');
  const result = await findCatById(req.params.id);
  console.log(result);

  if (!result) {
    const error = new Error('Not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    return next(new Error(result.error));
  }
  res.json(serializeCat(result));
};

const getCatByOwnerId = async (req, res, next) => {
  console.log('GET cat by owner id.');
  const result = await findCatsByOwnerId(req.params.ownerId);

  if (!result) {
    const error = new Error('Not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    return next(new Error(result.error));
  }
  res.json(serializeCat(result));
};

const postCat = async (req, res, next) => {
  console.log('POST cat.');

  console.log('Request form data: ', req.body);
  console.log('Request image metadata: ', req.file);

  // const filepath = `http://${req.get('host')}/uploads/${req.file.filename}`;

  const {cat_name, weight, owner, birthdate} = req.body;
  const result = await addCat({
    cat_name: cat_name,
    weight: weight,
    owner: owner,
    filename: req.file.filename,
    birthdate: birthdate,
  });
  if (!result) {
    const error = new Error('Not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    return nextTick(new Error(result.error));
  }

  res.status(201).json({message: 'New cat added.', result});
};

const putCat = async (req, res, next) => {
  console.log('PUT cat.');
  // if (req.file) {
  //   const filePath = `http://${req.get('host')}/uploads/${req.file.filename}`;
  //   req.body.filename = filePath;
  // }
  if (req.file) {
    req.body.filename = req.file.filename;
  }
  const result = await replaceCat(req.params.id, req.body);

  if (result) {
    res.status(200).json({message: 'Cat item updated.', result});
  } else {
    const result = await addCat(req.body);
    if (result.error) {
      return next(new Error(result.error));
    }
    res.status(201).json({message: 'New cat added.', result});
  }
};

const deleteCat = async (req, res, next) => {
  console.log('DELETE cat.');
  const result = await removeCat(req.params.id);

  if (!result) {
    const error = new Error('Not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    return next(new Error(result.error));
  }
  res.sendStatus(200).json({message: 'Cat item deleted.', result});
};

function getCatImageUrl(filename) {
  if (!filename) return null;
  const url = `http://${process.env.DOMAIN}/uploads/${filename}`;
  return url;
}

const serializeCat = (row) => ({
  cat_id: row.cat_id,
  cat_name: row.cat_name,
  weight: row.weight,
  owner: row.owner,
  filename: getCatImageUrl(row.filename),
  birthdate: row.birthdate,
});

export {getCats, getCatById, getCatByOwnerId, postCat, putCat, deleteCat};
