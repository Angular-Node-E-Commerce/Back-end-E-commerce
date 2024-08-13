const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");

// Custom Error Class
const AppError = require("./utils/AppError");

// Import routes here
// ---------------------

// ---------------------

// Define Express app
const app = express();

// Load environment variables
dotenv.config();

// Use middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// Use Routes
// ---------------------

// ---------------------

// Not Found Routes
app.all("*", (req, res, next) => {
  throw new AppError(
    `Error : Can't find ${req.originalUrl} on this server!`,
    404
  );
});

// Global Error Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode).send({ message: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
