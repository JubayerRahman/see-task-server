const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w7xbhfw.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const CreateTask = client.db("TaskData").collection("todo tasks")
    const CompleteTask = client.db("TaskData").collection("completed tasks")

    app.get('/tasks', async(req, res)=>{
        const tasksData= CreateTask.find()
        const result = await tasksData.toArray()
        res.send(result)
    })
    app.delete("/tasks/:id", async(req, res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const result = await CreateTask.deleteOne(filter)
        res.send(result) 
    })

    app.post('/tasks', async(req, res)=>{
        const tasksData= req.body
        const result = await CreateTask.insertOne(tasksData)
        res.send(result)
    })

    app.get("/completeTasks", async(req, res)=>{
        const tasksData= CompleteTask.find()
        const result = await tasksData.toArray()
        res.send(result)
    })
    app.post('/completeTasks', async(req, res)=>{
        const tasksData= req.body
        const result = await CompleteTask.insertOne(tasksData)
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


app.get("/", async( req, res)=>{
    res.send("Server")
})

app.listen(PORT)