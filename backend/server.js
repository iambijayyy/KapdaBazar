import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import audit from "./log.js"
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import logoutAfterInactivity from "./middleware/logoutAfterInactivity.js";
import logging from './basiclog.js';

dotenv.config();

connectDB();

const app = express();
// app.use(logoutAfterInactivity);

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  logging.logMessage(`${req.method}\t${req.headers.origin}\t${req.path}`);
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Runn....");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//runingin
