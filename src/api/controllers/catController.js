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

const getCats = async (req, res) => {
  console.log('GET all cats.');
  const cats = await listAllCats();
  res.json(cats.map(serializeCat));
};

const getCatById = async (req, res) => {
  console.log('GET cat by id.');
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(serializeCat(cat));
  } else {
    res.sendStatus(404);
  }
};

const getCatByOwnerId = async (req, res) => {
  console.log('GET cat by owner id.');
  const cat = await findCatsByOwnerId(req.params.ownerId);
  if (cat) {
    res.json(serializeCat(cat));
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
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

  if (result) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  console.log('PUT cat.');
  // if (req.file) {
  //   const filePath = `http://${req.get('host')}/uploads/${req.file.filename}`;
  //   req.body.filename = filePath;
  // }
  const result = await replaceCat(req.params.id, req.body);
  if (result) {
    res.status(200);
    res.json({message: 'Cat item updated.', result});
  } else {
    const result = addCat(req.body);
    res.status(201);
    res.json({message: 'New cat added.', result});
  }
};

const deleteCat = async (req, res) => {
  console.log('DELETE cat.');
  const result = await removeCat(req.params.id);
  if (result) {
    res.status(200);
    res.json({message: 'Cat item deleted.', result});
  } else {
    res.sendStatus(404);
  }
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
