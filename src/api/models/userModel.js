const users = [
  {
    id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@mail.com',
    role: 'user',
    password: 'password',
  },
  {
    id: 3608,
    name: 'Jack Black',
    username: 'xJackx',
    email: 'jblack@mail.com',
    role: 'user',
    password: 'password',
  },
];

const listAllUsers = () => {
  return users;
};

const findUserById = (id) => {
  return users.find((user) => user.id == id);
};

const addUser = (newuser) => {
  const {name, username, email, role, password} = newuser;
  const newId = users[0].id + 1;
  users.unshift({id: newId, name, username, email, role, password});
  return {id: newId};
};

const replaceUser = (id, newuser) => {
  const {name, username, email, role, password} = newuser;
  const index = users.indexOf(users.find((user) => user.id == id));
  users[index] = {id: id, name, username, email, role, password};
  return {id: id};
};

const removeUser = (id) => {
  const userIndex = users.indexOf(users.find((user) => user.id == id));
  return users.splice(userIndex, 1)[0];
};

export {listAllUsers, findUserById, addUser, replaceUser, removeUser};
