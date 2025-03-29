// ✅ Express Server Setup for API + AngularJS Frontend
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Dynamic CORS Configuration for Local Frontend Ports
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3003'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked Origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/merchantDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Load Routes
app.use("/api", routes);
console.log("✅ Routes Loaded: /auth, /merchants, /users, /devices, /residuals, /dashboard");

// ✅ Serve AngularJS Frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Fallback to index.html for Angular Routes
app.get('*', (req, res) => {
  console.log(`🌐 Serving frontend for route: ${req.url}`);
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
