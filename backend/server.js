import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const url =
    process.env.MONGO_URI ||
    "mongodb+srv://zunoon:passop@passop.8sntze4.mongodb.net/passop?retryWrites=true&w=majority&appName=passop";

const client = new MongoClient(url);
const dbName = "passop";
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas (before routes)
try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const collection = db.collection("passwords");

    // 🔹 Get all passwords
    app.get("/", async(req, res) => {
        try {
            const findResult = await collection.find({}).toArray();
            res.json(findResult);
        } catch (err) {
            console.error("❌ Error fetching passwords:", err);
            res.status(500).json({ success: false, message: "Database error" });
        }
    });

    // 🔹 Save new password
    app.post("/", async(req, res) => {
        try {
            const password = req.body;
            const result = await collection.insertOne(password);
            res.json({
                success: true,
                message: "Record inserted successfully",
                insertedId: result.insertedId,
            });
        } catch (err) {
            console.error("❌ Insert error:", err);
            res.status(500).json({ success: false, message: "Insert failed" });
        }
    });

    app.put('/:id', async(req, res) => {
        try {
            const { id } = req.params;
            const { site, username, password } = req.body;

            const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { site, username, password } });

            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Record not found!" });
            }

            res.json({ success: true, message: "Record updated successfully!" });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Server error" });
        }
    });

    // 🔹 Delete password by ID
    app.delete("/:id", async(req, res) => {
        try {
            const { id } = req.params;
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Record not found!" });
            }

            res.json({
                success: true,
                message: `Record deleted successfully (ID: ${id})`,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Server error" });
        }
    });

    // Start the server after DB connects
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
} catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
}