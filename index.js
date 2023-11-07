const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

// console.log(process.env.DB_PASS);


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-8pabrgd-shard-00-00.q1kedym.mongodb.net:27017,ac-8pabrgd-shard-00-01.q1kedym.mongodb.net:27017,ac-8pabrgd-shard-00-02.q1kedym.mongodb.net:27017/?ssl=true&replicaSet=atlas-uqgq0w-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serv = client.db('traviloDB').collection('services')
    const allserv = client.db('traviloDB').collection('allservices')
    const addBook = client.db('traviloDB').collection('booking')

    app.get('/services', async (req, res) => {
      const cursor = serv.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/mybooking', async (req, res) => {
      const cursor = addBook.find()
      const result = await cursor.toArray()
      res.send(result) 
    })

    app.get('/Details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allserv.findOne(query)
      res.send(result);
    })

    app.get('/allservices/:id', async (req, res) => {

      const id = req.params.id;
      // console.log(name);
      const query = { _id: new ObjectId(id) }
      const result = await allserv.find(query).toArray()
      res.send(result);
    })


    app.get('/allservices', async (req, res) => {
      const cursor = allserv.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/allservices', async(req,res) =>{
      const addService = req.body;
      console.log(addService);
      const result = await allserv.insertOne(addService)
      res.send(result)
    })

    app.post('/booking', async (req, res) => {
      const addBooking = req.body;
      console.log(addBooking);
      const result = await addBook.insertOne(addBooking)
      res.send(result)
    }) 






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello From Travilo')
})

app.listen(port, () => {
  console.log(`Travilo Guide is running ${port}`);
})