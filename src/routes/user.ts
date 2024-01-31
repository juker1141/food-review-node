import express, { Request, Response } from "express";

import User from "../models/user.model";

import { errorResponse } from "../util/error";

const router = express.Router();

// router.get("/users", (req: Request, res: Response) => {
//   // res.send("Hello World!");
//   console.log(req.body);

//   const user = User.findAll({});
//   res.status(200).json({ message: "create user success.", user });
// });

router.post("/user", async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const user = await User.create({
      username: req.body.username,
      account: req.body.account,
      userImage: "images/default_avatar.png",
      email: req.body.email,
      hashedPassword: "123",
    });

    res.status(200).json({ message: "create user success.", user });
  } catch (err: any) {
    res.status(500).json(errorResponse(err));
  }
});

export default router;
