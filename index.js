const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yi7qc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('job_task').collection('tasks');
        app.get('/task', async (req, res) => {
            console.log('query', req.query);
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks)
        })
        //Edit Task

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    task: updateUser.task,
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })
        //POST
        app.post('/task', async (req, res) => {
            console.log('task', req.body);
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });
        //Detete
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Job Task")
})
app.listen(port, () => {
    console.log(`Job Task on port ${port}`)
})