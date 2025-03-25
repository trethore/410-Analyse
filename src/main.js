const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const { loadData } = require('./data/mongo/loaddata');
const { saveData, loadDataFromCache } = require('./data/cacheManager');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'web')));
app.use(express.json());

app.use('/leaflet', express.static(path.join(__dirname, '..', 'node_modules', 'leaflet', 'dist')));
app.use('/leaflet-markercluster', express.static(path.join(__dirname, '..', 'node_modules', 'leaflet.markercluster', 'dist')));

const mongoUri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

client.connect()
  .then(() => console.log('Connected to MongoDB for API'))
  .catch(err => console.error(err));

app.post('/import', async (req, res) => {
    const amount = parseInt(req.body.amount, 10);
    if (isNaN(amount) || amount < 1) return res.status(400).send('Invalid amount');
    try {
        const result = await loadData(client, amount);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during import');
    }
});

app.post('/save', async (req, res) => {
  try {
      const articles = await client.db('db').collection('articlesWithCoords').find().toArray();
      saveData(articles);
      res.send('Données sauvegardées en cache');
  } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la sauvegarde');
  }
});

app.post('/loadFromCache', async (req, res) => {
  try {
      const cachedData = loadDataFromCache();
      if (!cachedData || !cachedData.length) return res.status(404).send('Cache vide ou inexistant');

      const db = client.db('db');
      const collection = db.collection('articlesWithCoords');

      await collection.deleteMany({});
      await collection.insertMany(cachedData);

      res.send('Données chargées depuis le cache dans MongoDB');
  } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement depuis le cache');
  }
});

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
