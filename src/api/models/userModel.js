import promisePool from '../../utils/database.js';

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects from the wsk_users table
 * @throws {Error} Throws an error if the database query fails
 */
const listAllUsers = async () => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

/**
 * Finds a user by their ID from the database
 *
 * @param {number|string} id - The user ID to search for
 * @returns {Promise<Object|boolean>} Returns the user object if found, or false if no user exists with the given ID
 * @throws {Error} Throws an error if database query fails
 */
const findUserById = async (id) => {
  const sql = 'SELECT * FROM wsk_users WHERE user_id = ?';
  const [rows] = await promisePool.execute(sql, [id]);
  console.log('rows', rows);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

/**
 * Finds a user by their username in the database.
 *
 * @param {string} username - The username to search for
 * @returns {Promise<Object|boolean>} Returns the user object if found, or false if no user exists with the given username
 * @throws {Error} Throws an error if database query fails
 * @description Executes a SQL query to find a user in the wsk_users table by username. Logs the query results to console.
 */
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM wsk_users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  console.log('rows', rows);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

/**
 * Adds a new user to the database.
 *
 * @param {Object} newuser - The user object containing user details
 * @param {string} newuser.name - The full name of the user
 * @param {string} newuser.username - The username for the user
 * @param {string} newuser.email - The email address of the user
 * @param {string} newuser.password - The password for the user
 * @param {string} newuser.role - The role assigned to the user
 * @returns {Promise<Object|boolean>} Returns an object with the new user's ID if successful, or false if the insertion fails
 * @throws {Error} Throws an error if the database query fails
 * @description Inserts a new user record into the wsk_users table with the provided user details. Logs the query results to console.
 */
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

/**
 * Replaces a user's data in the database with new user information.
 *
 * @param {number|string} id - The unique identifier of the user to be replaced
 * @param {Object} newUser - The new user data object containing the fields to update
 * @returns {Promise<Object|boolean>} Returns an object with success message if update is successful,
 *                                   or false if no rows were affected (user not found)
 * @throws {Error} May throw database connection or query execution errors
 */
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

/**
 * Removes a user and all associated cats from the database within a transaction.
 *
 * @param {string|number} id - The unique identifier of the user to be removed
 * @returns {Promise<Object>} A promise that resolves to an object containing a message
 * @returns {Promise<Object>} returns.message - Success message "User deleted" or error message
 * @throws {Error} Will throw an error if database operation fails
 * @description This function performs a cascading delete operation by first removing
 * all cats owned by the user from wsk_cats table, then removing the user from wsk_users table.
 * All operations are wrapped in a database transaction to ensure data consistency.
 * If any operation fails, the transaction is rolled back.
 */
const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?;', [id]);
    const [uResult] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?;',
      [id]
    );

    if (uResult.affectedRows === 0) {
      await connection.rollback();
      return false;
    }
    await connection.commit();
    return {message: 'User deleted'};
  } catch (error) {
    await connection.rollback();
    console.error('error', error.message);
    return false;
  } finally {
    connection.release();
  }
};

export {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  replaceUser,
  removeUser,
};
