// This is the main entry point for the backend server.
// It sets up an Express server, connects to MongoDB, and serves the AngularJS frontend.
// It also mounts API routes for handling requests.

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/merchantDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Mount API Routes FIRST
app.use("/api", routes);

// ✅ Static Frontend Serving (AngularJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ LAST: Catch-All for Angular Routes
// (only hit if no API route or static file matched)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
