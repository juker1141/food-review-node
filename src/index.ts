import express from "express";
import reviewRoutes from "./routes/review";

const app = express();

const port = 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(reviewRoutes);

app.listen(port, () => {
  if (port === 6000) {
    console.log("true");
  }
  console.log(`server is listening on ${port} !!!`);
});
