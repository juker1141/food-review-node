import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";

import schemaValidator from "../middleware/schemaValidator";

import User from "../models/user.model";

const router = express.Router();

// router.get("/users", (req: Request, res: Response) => {
//   // res.send("Hello World!");
//   console.log(req.body);

//   const user = User.findAll({});
//   res.status(200).json({ message: "create user success.", user });
// });

type ReqRegisterBody = {
  username: string;
  account: string;
  email: string;
  password: string;
  confirm_password: string;
};

router.post(
  "/user/signup",
  schemaValidator("/auth/user/signup"),
  async (req: Request<{}, {}, ReqRegisterBody>, res: Response) => {
    try {
      const user = await User.create({
        username: req.body.username,
        account: req.body.account,
        userImage: "images/default_avatar.png",
        email: req.body.email,
        hashedPassword: req.body.password,
      });

      return res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ errors: "Interlnal Error." });
    }
  }
);

export default router;
