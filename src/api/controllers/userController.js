import {
  listAllUsers,
  findUserById,
  addUser,
  replaceUser,
  removeUser,
} from '../models/userModel.js';

const getUsers = async (req, res) => {
  console.log('GET all users.');
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  console.log('GET user by id.');
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  console.log('POST user.', req.body);
  const result = await addUser(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  console.log('PUT user.');
  const result = await replaceUser(req.params.id, req.body);
  if (result) {
    res.status(200);
    res.json({message: 'User item updated.', result});
  } else {
    const result = await addUser(req.body);
    res.status(201);
    res.json({message: 'New user added.', result});
  }
};

const deleteUser = async (req, res) => {
  console.log('DELETE user');
  const result = await removeUser(req.params.id);
  if (result) {
    res.status(200);
    res.json({message: 'User item deleted.', result});
  } else {
    res.sendStatus(404);
  }
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
