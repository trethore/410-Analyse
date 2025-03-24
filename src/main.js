const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express()
const port = 3000;

app.use(express.static(path.join(__dirname, 'web')));

const mongoUri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

client.connect()
  .then(() => console.log('Connected to MongoDB for API'))
  .catch(err => console.error(err));

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await client.db('citiesdb').collection('cities').find().toArray();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cities');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'html', 'home.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});