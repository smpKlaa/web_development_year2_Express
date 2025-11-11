import {
  listAllUsers,
  findUserById,
  addUser,
  replaceUser,
  removeUser,
} from '../models/userModel.js';

const getUsers = (req, res) => {
  console.log('GET all users.');
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  console.log('GET user by id.');
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  console.log('POST user.');
  const result = addUser(req.body);
  if (result.id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  console.log('PUT user.');
  const user = findUserById(req.params.id);
  if (user.id) {
    const id = replaceUser(user.id, req.body);
    res.status(200);
    res.json({message: 'User item updated.', id});
  } else {
    const newId = addUser(req.body);
    res.status(201);
    res.json({message: 'New user added.', newId});
  }
};

const deleteUser = (req, res) => {
  console.log('DELETE user.');
  const user = findUserById(req.params.id);
  if (user.id) {
    const removedUser = removeUser(user.id);
    res.status(200);
    res.json({message: 'User item deleted.', removedUser});
  } else {
    res.sendStatus(404);
  }
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
