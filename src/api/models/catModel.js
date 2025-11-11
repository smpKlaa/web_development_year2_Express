import promisePool from '../../utils/database.js';

// const cats = [
//   {
//     id: 2,
//     name: 'Mint',
//     birthdate: '1970-01-01',
//     weight: 6,
//     owner: 'John',
//     image: 'http://127.0.0.1:3000/public/orange_cat.jpg',
//   },
//   {
//     id: 1,
//     name: 'Cinnamon',
//     birthdate: '2038-1-19',
//     weight: 7,
//     owner: 'Jack',
//     image: 'http://127.0.0.1:3000/public/siamese_cat.jpg',
//   },
// ];

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT 
    wsk_cats.cat_id, 
    wsk_cats.cat_name, 
    wsk_cats.weight, 
    wsk_users.name AS owner,
    wsk_cats.filename, 
    wsk_cats.birthdate 
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id`);
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `
    SELECT
    wsk_cats.cat_id, 
    wsk_cats.cat_name, 
    wsk_cats.weight, 
    wsk_users.name AS owner,
    wsk_cats.filename, 
    wsk_cats.birthdate
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
    WHERE cat_id = ?`,
    [id]
  );
  console.log('rows', rows);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatsByOwnerId = async (ownerId) => {
  const [rows] = await promisePool.execute(
    `
    SELECT
    wsk_cats.cat_id, 
    wsk_cats.cat_name, 
    wsk_cats.weight, 
    wsk_users.name AS owner,
    wsk_cats.filename, 
    wsk_cats.birthdate
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
    WHERE owner = ?`,
    [ownerId]
  );
  console.log('rows', rows);

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (newCat) => {
  const {cat_name, weight, owner, filename, birthdate} = newCat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const replaceCat = async (id, newCat) => {
  const sql = promisePool.format('UPDATE wsk_cats SET ? WHERE cat_id = ?', [
    newCat,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

export {
  listAllCats,
  findCatById,
  findCatsByOwnerId,
  addCat,
  replaceCat,
  removeCat,
};
