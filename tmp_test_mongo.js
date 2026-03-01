const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://ikshittalera:ikshittalera@cluster0.kbot2rm.mongodb.net/upvote?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    const client = new MongoClient(url);
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully!');
        const db = client.db('upvote');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('Connection failed:');
        console.error(err);
    } finally {
        await client.close();
    }
}

testConnection();
