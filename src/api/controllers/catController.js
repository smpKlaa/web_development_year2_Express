import {
  listAllCats,
  findCatById,
  addCat,
  replaceCat,
  removeCat,
} from '../models/catModel.js';

const getCats = async (req, res) => {
  console.log('GET all cats.');
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  console.log('GET cat by id.');
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  console.log('POST cat.');

  console.log('Request form data: ', req.body);
  console.log('Request image metadata: ', req.file);

  const filePath = `http://${req.get('host')}/uploads/${req.file.filename}`;
  const {cat_name, weight, owner, birthdate} = req.body;
  const result = await addCat({
    cat_name: cat_name,
    weight: weight,
    owner: owner,
    filename: filePath,
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
  if (req.file) {
    const filePath = `http://${req.get('host')}/uploads/${req.file.filename}`;
    req.body.filename = filePath;
  }
  const result = await replaceCat(req.params.id, req.body);
  if (result) {
    res.status(200);
    res.json({message: 'Cat item updated.', result});
  } else {
    const newId = addCat(req.body);
    res.status(201);
    res.json({message: 'New cat added.', newId});
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

export {getCats, getCatById, postCat, putCat, deleteCat};
