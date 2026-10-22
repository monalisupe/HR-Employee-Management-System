const express = require("express");
const cors = require("cors");
// const supabase = require("./config/supabase");

const app = express();

app.use(cors({
  origin:"http://localhost:5173",
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SecureTenant API is running",
  });
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SecureTenant backend is working correctly",
  });
});

module.exports = app;