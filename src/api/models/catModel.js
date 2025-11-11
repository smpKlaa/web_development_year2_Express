const cats = [
  {
    id: 2,
    name: 'Mint',
    birthdate: '1970-01-01',
    weight: 6,
    owner: 'John',
    image: 'http://127.0.0.1:3000/public/orange_cat.jpg',
  },
  {
    id: 1,
    name: 'Cinnamon',
    birthdate: '2038-1-19',
    weight: 7,
    owner: 'Jack',
    image: 'http://127.0.0.1:3000/public/siamese_cat.jpg',
  },
];

const listAllCats = () => {
  return cats;
};

const findCatById = (id) => {
  return cats.find((cat) => cat.id == id);
};

const addCat = (newCat, imagePath) => {
  const {name, birthdate, weight, owner} = newCat;
  const newId = cats[0].id + 1;
  cats.unshift({id: newId, name, birthdate, weight, owner, image: imagePath});
  return {id: newId};
};

const replaceCat = (id, newCat, imagePath) => {
  const {name, birthdate, weight, owner} = newCat;
  const index = cats.indexOf(cats.find((cat) => cat.id == id));
  cats[index] = {id: id, name, birthdate, weight, owner, image: imagePath};
  return {id: id};
};

const removeCat = (id) => {
  const catIndex = cats.indexOf(cats.find((cat) => cat.id == id));
  return cats.splice(catIndex, 1)[0];
};

export {listAllCats, findCatById, addCat, replaceCat, removeCat};
