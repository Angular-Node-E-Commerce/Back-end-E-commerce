const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");
const path = require("path");

// Custom Error Class
const AppError = require("./utils/AppError");
const logger = require("./utils/logger");

// Import routes here
// ---------------------
const gamesRouter = require("./routes/gamesRouter");
const usersRouter = require("./routes/usersRouter");
const ordersRouter = require("./routes/ordersRoutes");
const reviewsRouter = require("./routes/reviewsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const cartRouter = require("./routes/cartRoutes");
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
app.use("/api/v1/games", gamesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", (req, res) => {
  res.send({ message: "Welcome To the Server" });
});

// ---------------------

// Not Found Routes
app.all("/*", (req, res, next) => {
  throw new AppError(
    `Error : Can't find ${req.originalUrl} on this server!`,
    404
  );
});

// Global Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    logger.info("Connected to MongoDB Server");
    app.listen(process.env.PORT, () => {
      logger.info(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB", err);
  });
