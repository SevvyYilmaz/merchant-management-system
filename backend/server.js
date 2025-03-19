// backend entry point 
// Express server set up, connect to MongoDB,
// // & define routes for authentication, merchants, users, devices, and residuals

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";  // Ensure correct path

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
