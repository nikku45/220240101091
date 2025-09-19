// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./route/urlshortenRoutes.js";
import { logger } from '../Logging Middleware/logger.js'



dotenv.config();

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);


// Routes
app.use("/api/url", urlRoutes);

app.use("/",(req,res)=>{
 res.send("url shortner home api")
})



// DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/urlshortner", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));


