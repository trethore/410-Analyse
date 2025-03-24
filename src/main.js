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
    const cities = await client.db('db').collection('cities').find().toArray();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cities');
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await client.db('db').collection('articles').find().toArray();
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving articles');
  }
});

app.get('/api/articlesWithCoords', async (req, res) => {
  try {
    const enrichedArticles = await client.db('db').collection('articlesWithCoords').find().toArray();
    res.json(enrichedArticles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving enriched articles');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'html', 'home.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});