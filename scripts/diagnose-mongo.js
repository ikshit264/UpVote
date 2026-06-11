require('dotenv').config();
const { MongoClient } = require('mongodb');

const hosts = [
  'ac-4xyvmrt-shard-00-00.kbot2rm.mongodb.net',
  'ac-4xyvmrt-shard-00-01.kbot2rm.mongodb.net',
  'ac-4xyvmrt-shard-00-02.kbot2rm.mongodb.net',
];

(async () => {
  for (const h of hosts) {
    const url = `mongodb://ikshittalera:ikshittalera@${h}:27017/upvote?tls=true&authSource=admin&directConnection=true&serverSelectionTimeoutMS=15000`;
    console.log(`\n--- ${h} ---`);
    const client = new MongoClient(url, { connectTimeoutMS: 15000, socketTimeoutMS: 15000 });
    try {
      console.time('connect');
      await client.connect();
      console.timeEnd('connect');
      const r = await client.db('admin').command({ hello: 1 });
      console.log('hello result -> isWritablePrimary:', r.isWritablePrimary, 'setName:', r.setName, 'me:', r.me);
    } catch (err) {
      console.error('FAIL:', err.constructor.name, err.code || '', err.message);
    } finally {
      await client.close();
    }
  }
})();
