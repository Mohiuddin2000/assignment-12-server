const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dgcokvy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('Sell-Phone').collection('categories');
        const phoneCollection = client.db('Sell-Phone').collection('PhoneCollection');
        const orderCollection = client.db('Sell-Phone').collection('order');
        const userCollection = client.db('Sell-Phone').collection('user');
        const advertiseCollection = client.db('Sell-Phone').collection('adverise');


        app.get('/categories', async (req, res) => {
            const query = -{}
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        app.get('/category/:Id', async (req, res) => {
            const companyName = req.params.Id;
            console.log(companyName);
            const query = { company: companyName };
            const cursor = phoneCollection.find(query);
            const category = await cursor.toArray();
            res.send(category);
        });

        app.post('/order', async (req, res) => {
            const ordered = req.body;
            console.log(ordered);
            const result = await orderCollection.insertOne(ordered);
            res.send(result);
        })
        // verifyJWT,
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            // const decodedEmail = req.decoded.email;

            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' });
            // }
            const query = { userEmail: email };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        })

        app.post('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const stored = await userCollection.find(query).toArray();
            if (stored.length == 0) {
                console.log(stored);
                const user = req.body;
                console.log(user);
                const result = await userCollection.insertOne(user);
                res.send(result);
            }
        })

        app.get('/user', async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const stored = await userCollection.find(query).toArray();
            res.send(stored);
        })

        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const stored = await userCollection.find(query).toArray();
            res.send(stored);
        })

        app.post('/add-product', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await phoneCollection.insertOne(product);
            res.send(result);
        })

        app.get('/myproducts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const stored = await phoneCollection.find(query).toArray();
            res.send(stored);
        })

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await phoneCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await phoneCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/advertise', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await advertiseCollection.insertOne(product);
            res.send(result);
        })

        app.get('/advertise', async (req, res) => {
            const query = -{}
            const cursor = advertiseCollection.find(query);
            const advertiseitems = await cursor.toArray();
            res.send(advertiseitems);
        })

        app.delete('/user-delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(err => console.error(err));
app.get('/', (req, res) => {
    res.send('Service API running');
});
app.listen(port, () => {
    console.log('Service API Server running on port', port);
})
