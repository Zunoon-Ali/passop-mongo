import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");

        const db = client.db("passop");
        const collection = db.collection("passwords");

        const data = await collection.find({}).toArray();
        console.log("📦 Passwords collection data:", data);

    } catch (err) {
        console.error("❌ Connection error:", err);
    } finally {
        await client.close();
    }
}

connectDB();