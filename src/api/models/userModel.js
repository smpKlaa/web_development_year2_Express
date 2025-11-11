import promisePool from '../../utils/database.js';

// const users = [
//   {
//     id: 3609,
//     name: 'John Doe',
//     username: 'johndoe',
//     email: 'john@mail.com',
//     role: 'user',
//     password: 'password',
//   },
//   {
//     id: 3608,
//     name: 'Jack Black',
//     username: 'xJackx',
//     email: 'jblack@mail.com',
//     role: 'user',
//     password: 'password',
//   },
// ];

const listAllUsers = async () => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const sql = 'SELECT * FROM wsk_users WHERE user_id = ?';
  const [rows] = await promisePool.execute(sql, [id]);
  console.log('rows', rows);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (newuser) => {
  const {name, username, email, password, role} = newuser;
  const sql =
    'INSERT INTO wsk_users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
  const params = [name, username, email, password, role];
  const [rows] = await promisePool.execute(sql, params);
  console.log('rows', rows);

  if (rows.affectedRows === 0) {
    return false;
  }
  return {user_id: rows.insertId};
};

const replaceUser = async (id, newUser) => {
  const sql = promisePool.format('UPDATE wsk_users SET ? WHERE user_id = ?', [
    newUser,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    const [cResult] = await connection.execute(
      'DELETE FROM wsk_cats WHERE owner = ?;',
      [id]
    );
    const [uResult] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?;',
      [id]
    );

    if (cResult.affectedRows === 0 || uResult.affectedRows === 0) {
      return {
        message: 'User not deleted',
      };
    }
    await connection.commit();
    return {message: 'User deleted'};
  } catch (error) {
    await connection.rollback();
    console.error('error', error.message);
    return {message: error.message};
  } finally {
    connection.release();
  }
};

export {listAllUsers, findUserById, addUser, replaceUser, removeUser};
