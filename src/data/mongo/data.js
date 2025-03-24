const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const ini = require('ini');

const uri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const CONFIG_PATH = path.join(__dirname, '..', '..', 'config.cfg');
const API_URL = 'https://api.archives-ouvertes.fr/search/';
const BATCH_SIZE = 1000;

async function loadConfig() {
  const config = ini.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  return parseInt(config.MAX_DATA, 10) || 1000;
}

async function fetchData(start, rows) {
  const params = {
    q: 'structCountry_s:fr AND city_s:* AND title_s:* AND authFullName_s:* AND labStructAddress_s:* AND uri_s:* AND producedDateY_i:* AND labStructAcronym_s:*',
    wt: 'json',
    fl: 'authFullName_s,producedDateY_i,publisher_s,docid,uri_s,title_s,fileMain_s,labStructAcronym_s,page_s,structCountry_s,city_s,labStructAddress_s',
    rows,
    start,
  };

  try {
    const response = await axios.get(API_URL, { params });
    return response.data.response.docs;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function importData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('db');
    const collection = database.collection('articles');

    const MAX_DATA = await loadConfig();
    console.log(`Fetching up to ${MAX_DATA} documents...`);
    
    let allResults = [];
    for (let start = 0; start < MAX_DATA; start += BATCH_SIZE) {
      console.log(`Fetching data from ${start} to ${start + BATCH_SIZE}...`);
      const batch = await fetchData(start, Math.min(BATCH_SIZE, MAX_DATA - start));
      if (batch.length === 0) break;
      allResults = allResults.concat(batch);
    }

    if (allResults.length > 0) {
      console.log(`Inserting ${allResults.length} documents`);
      await collection.insertMany(allResults);
      console.log('Data inserted successfully');
    } else {
      console.log('No data to insert');
    }

    await client.close();
  } catch (err) {
    console.error(err);
  }
}

importData();
