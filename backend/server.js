
// require("dotenv").config();

// const app = require("./app");
// // const connectDB = require("./config/db");

// const PORT = process.env.PORT || 5000;

// // const startServer = async() => {
// //   await connectDB();

// app.listen(PORT, () => {
//   console.log(`SecureTenant server running on port ${PORT}`);
// });

// //}

// startServer();


require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SecureTenant server running on port ${PORT}`);
});
