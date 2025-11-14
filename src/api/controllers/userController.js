import bcrypt from 'bcrypt';
import {
  listAllUsers,
  findUserById,
  addUser,
  replaceUser,
  removeUser,
} from '../models/userModel.js';
// import {validationResult} from 'express-validator';

const getUsers = async (req, res) => {
  console.log('GET all users.');
  const result = await listAllUsers();

  if (result.error) {
    return next(new Error(result.error));
  }
  res.sendStatus(200).json(result);
};

const getUserById = async (req, res) => {
  console.log('GET user by id.');
  const result = await findUserById(req.params.id);
  if (result.error) {
    return next(new Error(result.error));
  }
  res.sendStatus(200).json(result);
};

const postUser = async (req, res) => {
  console.log('POST user.', req.body);

  // TODO: implement this
  // const errors = validationResult(req);

  // check if any validation errors
  // if (!errors.isEmpty()) {
  //   // pass the error to the error handler middleware
  //   const error = new Error('Invalid or missing fields');
  //   error.status = 400;
  //   return next(error);
  // }

  // Hash user password
  req.body.password = bcrypt.hashSync(req.body.password, 10);

  // TODO: implement erppr handling for SQL errors.
  const result = await addUser(req.body);

  if (result.error) {
    return next(new Error(result.error));
  }
  res.sendStatus(200).json({message: 'New user added.', result});
};

const putUser = async (req, res) => {
  console.log('PUT user.');
  const result = await replaceUser(req.params.id, req.body);
  if (result) {
    res.status(200);
    res.json({message: 'User item updated.', result});
  } else {
    const result = await addUser(req.body);
    if (result.error) {
      return next(new Error(result.error));
    }
    res.status(201);
    res.json({message: 'New user added.', result});
  }
};

const deleteUser = async (req, res) => {
  console.log('DELETE user');
  const result = await removeUser(req.params.id);

  if (result.error) {
    return next(new Error(result.error));
  }
  res.sendStatus(200).json({message: 'User item deleted.', result});
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
