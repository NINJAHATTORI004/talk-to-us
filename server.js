// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Replace with your actual MongoDB connection string
const uri = "mongodb+srv://anshmittal132:<9LTLKDDYbDjOiCen>@cluster0.7odqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // or mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.post('/submit-feedback', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('talk-to-us');
        const collection = database.collection('responses');
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});