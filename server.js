// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb://localhost:27017";

// Create a new MongoClient instance
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Route to handle POST requests to /submit-feedback
app.post('/submit-feedback', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('talk-to-us');
        const collection = database.collection('responses');

        // Validate incoming data
        const feedbackData = {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            workEmail: req.body.workEmail,
            brandWebsiteLink: req.body.brandWebsiteLink,
            requirements: req.body.requirements,
            brandCategory: req.body.brandCategory,
            campaignBudget: req.body.campaignBudget,
            campaignStartDate: req.body.campaignStartDate,
            objective: req.body.objective,
            influencers: req.body.influencers,
            preferences: req.body.preferences,
            howDidYouHear: req.body.howDidYouHear
        };

        const result = await collection.insertOne(feedbackData); // Insert data
        res.status(201).json(result);  // Send back the result
    } catch (error) {
        res.status(500).send('Error connecting to the database: ' + error.message);
    } finally {
        await client.close(); // Close connection after the request is complete
    }
});

// Route to check if MongoDB connection is working
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

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});