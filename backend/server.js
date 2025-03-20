// Backend entry point
// Express server set up, connect to MongoDB,
// & define routes for authentication, merchants, users, devices, and residuals

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";  // ✅ Import MongoDB (Mongoose)
import routes from "./routes/index.js";  // Ensure correct path

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/merchantDB"; // Change to your database name
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api", routes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
