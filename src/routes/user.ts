import express, { Request, Response } from "express";

import schemaValidator from "../middleware/schemaValidator";
import authMiddleware from "../middleware/authMiddleware";

import User from "../models/user.model";
import { createUser, signIn, getUser } from "../controllers/user";

const router = express.Router();

// router.get("/users", (req: Request, res: Response) => {
//   // res.send("Hello World!");
//   console.log(req.body);

//   const user = User.findAll({});
//   res.status(200).json({ message: "create user success.", user });
// });

router.post("/user/signup", schemaValidator("/auth/user/signup"), createUser);

router.post("/user/signin", schemaValidator("/auth/user/signin"), signIn);

router.get("/user", authMiddleware, getUser);

export default router;
