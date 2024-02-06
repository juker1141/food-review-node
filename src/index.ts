import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { testDbConnection } from "./config/db";

import testingRoutes from "./routes/testing";
import userRoutes from "./routes/user";
import reviewRoutes from "./routes/review";
import shopRoutes from "./routes/shop";

const app = express();
dotenv.config();

app.use(
  cors()
  // cors({
  //   origin: "*",
  //   methods: "*",
  //   allowedHeaders: "*",
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/static", express.static(path.join(__dirname, "../public")));
app.use(testingRoutes);

app.use(userRoutes);
app.use(reviewRoutes);
app.use(shopRoutes);

const PORT = process.env.SERVER_PORT || 6300;

testDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });
});
