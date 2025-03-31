import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow AngularJS frontend
const allowedOrigins = ['http://localhost:3001'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/merchantDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api", routes);

// ✅ Serve frontend fallback (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ✅ Start
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
