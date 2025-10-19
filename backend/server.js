import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = "passop";
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

await client.connect();
const db = client.db(dbName);
const collection = db.collection("passwords");


// 🔹 Get all passwords
app.get("/", async (req, res) => {
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

app.post('/',async (req,res)=>{
  const password = req.body;
  const findResult = await collection.insertOne(password);
  res.json({findResult, success:true,message:"Record Insert Sucessfully"})
})

app.delete('/',async (req,res)=>{
try{
  const { _id } = req.body;
  const result = await collection.deleteOne({_id: new ObjectId(_id)})

  if(result.deletedCount === 0){
    return res.status(404).json({success:false,message:"Record Not Found !"});

  }

  res.json({
    result,success:true,message:"Record Deleted Sucessfully of Id: "+ _id
  });

}catch(e){
  console.error(e);
  res.status(500).json({success:true,message:"Server Error"})
}
  
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
