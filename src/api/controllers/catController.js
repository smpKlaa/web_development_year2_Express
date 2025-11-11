import {
  listAllCats,
  findCatById,
  addCat,
  replaceCat,
  removeCat,
} from '../models/catModel.js';

const getCats = (req, res) => {
  console.log('GET all cats.');
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  console.log('GET cat by id.');
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  console.log('POST cat.');
  const result = addCat(req.body);
  if (result.id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  console.log('PUT cat.');
  const cat = findCatById(req.params.id);
  if (cat.id) {
    const id = replaceCat(cat.id, req.body);
    res.status(200);
    res.json({message: 'Cat item updated.', id});
  } else {
    const newId = addCat(req.body);
    res.status(201);
    res.json({message: 'New cat added.', newId});
  }
};

const deleteCat = (req, res) => {
  console.log('DELETE cat.');
  const cat = findCatById(req.params.id);
  if (cat.id) {
    const removedCat = removeCat(cat.id);
    res.status(200);
    res.json({message: 'Cat item deleted.', removedCat});
  } else {
    res.sendStatus(404);
  }
};

export {getCats, getCatById, postCat, putCat, deleteCat};
