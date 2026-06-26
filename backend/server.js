const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// CHANGE THIS LINE TO MATCH YOUR EXACT FILE NAME:
const authRoutes = require('./routes/authRoutes.js'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. HARDCODE THE CONNECTION STRINGS DIRECTLY 
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/todoapp";

// 2. CONNECT TO MONGO DB
mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ Database connection error:", err.message));

// 3. ROUTES SETUP
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on port ${PORT}...`);
});