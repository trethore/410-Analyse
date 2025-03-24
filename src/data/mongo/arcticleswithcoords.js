const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb://root:1234@mongo:27017/citiesdb?authSource=admin';
const client = new MongoClient(mongoUri, { useUnifiedTopology: true });

async function enrichArticlesWithCoords() {
  try {
    await client.connect();
    const db = client.db('db');
    const cities = await db.collection('cities').find().toArray();
    const articles = await db.collection('articles').find().toArray();

    const enrichedArticles = articles.map(article => {
      if (article.city_s) {
        const cityMatch = cities.find(city => city.city_code.toLowerCase() === article.city_s.toLowerCase());
        if (cityMatch) {
          article.latitude = cityMatch.latitude;
          article.longitude = cityMatch.longitude;
          return article;
        }
      }
      return null;
    }).filter(article => article !== null);

    const result = await db.collection('articlesWithCoords').insertMany(enrichedArticles);
    console.log(`Enriched articles inserted: ${result.insertedCount}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

enrichArticlesWithCoords();
