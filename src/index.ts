import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "@/routes";

const app = express();
dotenv.config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

const PORT = process.env.SERVER_PORT || 6300;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
