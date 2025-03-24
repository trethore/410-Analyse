const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function importCSV() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('db');
    const collection = database.collection('cities');

    const results = [];
    fs.createReadStream(path.join(__dirname, '..', 'files', 'cities.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Inserting ${results.length} documents`);
        await collection.insertMany(results);
        console.log('CSV data inserted');
        await client.close();
      });
  } catch (err) {
    console.error(err);
  }
}

importCSV();
