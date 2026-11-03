
const express = require("express");
const cors = require("cors");

const app = express();

// CHANGE 1: Use a plain URL for the React frontend.
// Removed any Markdown link formatting from the origin.
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Existing middleware: parse incoming JSON request bodies.
app.use(express.json());

// Existing home route.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure tenant api running successfully",
  });
});

// Existing health-check route.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SecureTenant backend is working correctly",
  });
});


app.get("/api/health", (req,res) =>{
  res.status(400).json({
    success:true,
    message:"SecureTenant unauthorise error occur",
  });
});


// Existing authentication route.
app.use("/api/auth", require("./routes/authRoutes"));

module.exports = app;
