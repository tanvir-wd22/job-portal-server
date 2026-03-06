require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// instance and define
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// database setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.oko4eb5.mongodb.net/?appName=Cluster1`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log('db connected successfully');
    // =======================================================================

    // =======================================================================
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// routes setup
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// server start
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
