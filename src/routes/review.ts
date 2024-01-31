import express, { Request, Response } from "express";

const router = express.Router();

router.get("/reviews", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default router;
