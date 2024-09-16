const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

// Replace with your actual MongoDB connection string
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

app.use(bodyParser.json());

app.post('/submit-feedback', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('feedbackDB');
        const collection = database.collection('feedbacks');
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

// Add a new route to check the MongoDB connection
app.get('/check-connection', async (req, res) => {
    try {
        await client.connect();
        res.status(200).send('MongoDB connection is working!');
    } catch (error) {
        res.status(500).send('MongoDB connection failed: ' + error.message);
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});