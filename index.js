require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// instance and define
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// database setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.oko4eb5.mongodb.net/?appName=Cluster1`;
// console.log(uri);

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
    const database = client.db('jobsPortalDB');
    const jobsCollection = database.collection('jobsColl');
    const applicationsColl = database.collection('applicationsColl');

    // read operation for all jobs
    app.get('/jobs', async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // read operation for one job
    app.get('/jobs/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // create operation for applications
    app.post('/applications', async (req, res) => {
      const doc = req.body;
      const result = await applicationsColl.insertOne(doc);
      res.send(result);
    });

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
