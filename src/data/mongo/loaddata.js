const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { enrichArticlesWithCoords } = require('./arcticleswithcoords');

const API_URL = 'https://api.archives-ouvertes.fr/search/';
const BATCH_SIZE = 100;
const mongoUri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

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

async function importData(db, amountInHundreds) {
  const collection = db.collection('articles');
  await collection.deleteMany({});
  console.log('Old articles cleared.');

  const maxData = amountInHundreds * 100;
  console.log(`Fetching up to ${maxData} documents...`);

  let allResults = [];
  for (let start = 0; start < maxData; start += BATCH_SIZE) {
      console.log(`Fetching data from ${start} to ${start + BATCH_SIZE}...`);
      const batch = await fetchData(start, Math.min(BATCH_SIZE, maxData - start));
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
}

async function loadData(client, amount) {
  if (isNaN(amount) || amount < 1) {
      throw new Error('Invalid amount provided.');
  }

  const db = client.db('db');
  await importData(db, amount);
  await enrichArticlesWithCoords(db);
  return 'Import & enrichment completed successfully please reload the page';
}

module.exports = { loadData };
