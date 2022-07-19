const express = require("express");
const app = express();
const port = 3002;
const cors = require("cors");
const mongoose = require("mongoose");
const index = require("./usersdata/usersapi.json");
app.use(cors());
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { MongoClient, ServerApiVersion, MongoRuntimeError } = require("mongodb");
const { response } = require("express");

const password = encodeURIComponent("vaishanvi");
const uri = `mongodb+srv://vaishnavi:7408409741@cluster0.ba5h5.mongodb.net/Material?retryWrites=true`;
const client = new MongoClient(uri, {
  useNeWUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const perfect = {
  result: "success",
};

app.get("/", (req, res) => {
  res.send("final");
});
app.use(express.json());
app.post("/grocery/add", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  const collection = client.db("Material").collection("Products");
  const result = await collection.insertOne(data);
  console.log(result);
  res.send(perfect);
});

app.get("/grocery/getAll", async (req, res) => {
  const collection = client.db("Material").collection("Products");
  const result = await collection.find({}).toArray();
  console.log(result);
  res.send(result);
});

app.put("/grocery/updatePurchaseStatus/:id", async (req, res) => {
  console.log(req.body.id);
  const data = req.body;
  const collection = client.db("Material").collection("Products");


const result = await collection.updateOne(
    {
        _id:new mongodb.ObjectId(req.params.id)
    },
    {
        $set: {
            ispurchased:true
        }
    }); 
  console.log(result);
  res.send(perfect);
});

app.delete("/grocery/deleteGroceryItem/:id", async (req, res) => {
  console.log(req.params.id);
  const collection = client.db("Material").collection("Products");
  const result = await collection.deleteOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
console.log(result)
  res.send(result);
});
async function run() {} 

app.listen(port, async () => {
  run().catch(console.dir);
  console.log(`api is running in the number ${port}`); 
  client.connect(async (err) => {
    console.log(err);
    console.log("mongo connected");
  });
});
