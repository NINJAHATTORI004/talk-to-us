
// Import necessary modules

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); // MongoDB client

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string (replace with your own connection string)
const uri = "mongodb://localhost:27017";  // For local MongoDB (default port 27017)
// For MongoDB Atlas (Cloud), use a connection string like this:
// const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority";

// Create a new MongoClient instance
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Ensure we use the new connection engine
});

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Route to handle POST requests to /submit-feedback
app.post('/submit-feedback', async (req, res) => {
    try {
        await client.connect();  // Connect to MongoDB
        const database = client.db('talk-to-us');   // Use the 'talk-to-us' database
        const collection = database.collection('responses');  // Use the 'responses' collection
        const result = await collection.insertOne(req.body);  // Insert data
        res.status(201).json(result);  // Send back the result
    } catch (error) {
        res.status(500).send('Error connecting to the database: ' + error.message);
    } finally {
        await client.close();  // Close connection after the request is complete
    }
});

// Route to check if MongoDB connection is working
app.get('/check-connection', async (req, res) => {
    try {
        await client.connect();  // Connect to MongoDB
        res.status(200).send('MongoDB connection is working!');
    } catch (error) {
        res.status(500).send('MongoDB connection failed: ' + error.message);
    } finally {
        await client.close();  // Close connection after request
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});