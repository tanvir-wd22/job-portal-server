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
    const applicationsCollection = database.collection('appsColl');

    // ===================== rest api for users ================

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

    // create operation for jobs
    app.post('/jobs', async (req, res) => {
      const doc = req.body;
      const result = await jobsCollection.insertOne(doc);
      res.send(result);
    });

    // read operation for some applications
    app.get('/apps', async (req, res) => {
      const query = { applicant_email: req.query.email };
      const result = await applicationsCollection.find(query).toArray();
      // aggregate job data
      for (const appItem of result) {
        // console.log(appItem);
        // console.log(appItem.job_info_id);
        const query2 = { _id: new ObjectId(appItem.job_info_id) };
        const result2 = await jobsCollection.findOne(query2);
        if (result2) {
          appItem.title = result2.title;
          appItem.company = result2.company;
          appItem.company_logo = result2.company_logo;
          appItem.location = result2.location;
          appItem.jobType = result2.jobType;
        }
      }
      res.send(result);
    });

    // create operation for applications
    app.post('/apps', async (req, res) => {
      const doc = req.body;
      const result = await applicationsCollection.insertOne(doc);
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
