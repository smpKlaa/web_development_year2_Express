import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

const cats = [
  {
    cat_id: 1,
    name: 'Mint',
    birthdate: '1970-01-01',
    weight: 6,
    owner: 'John',
    image: `http://${hostname}:${port}/public/orange_cat.jpg`,
  },
  {
    cat_id: 2,
    name: 'Cinnamon',
    birthdate: '2038-1-19',
    weight: 7,
    owner: 'Jack',
    image: `http://${hostname}:${port}/public/siamese_cat.jpg`,
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

// GET all cats.
app.get('/api/v1/cats', (req, res) => {
  res.json(cats);
});

// GET cat by id.
app.get('/api/v1/cats/:id', (req, res) => {
  res.json(cats.find((cat) => cat.cat_id == req.params.id));
});

// POST cat.
app.use(express.json());
app.post('/api/v1/cats', (req, res) => {
  const body = req.body;

  const {name, birthdate, weight, owner, image} = body;

  cats.push({
    cat_id: cats.length + 1,
    name: name,
    birthdate: birthdate,
    weight: weight,
    owner: owner,
    image: image,
  });

  res.sendStatus(201);
});

app.use('/public', express.static('public'));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
