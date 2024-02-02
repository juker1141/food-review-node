import express, { Request, Response } from "express";
import Joi from "joi";

import { ValidationError } from "sequelize";

import schemaValidator from "../middleware/schemaValidator";

import User from "../models/user.model";

import { hashedPassword, checkPassword } from "../util/password";

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
      const hashedPw = hashedPassword(req.body.password);

      const user = await User.create({
        username: req.body.username,
        account: req.body.account,
        userImage: "images/default_avatar.png",
        email: req.body.email,
        hashedPassword: hashedPw,
      });

      return res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        // 驗證錯誤，可能是 email 或 username 不符合條件
        console.error("Validation error:", error.errors);
        return res
          .status(409)
          .json({ errors: error.errors.map((e) => e.message) });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        // 唯一性約束錯誤，可能是 email 或 username 重複
        console.error("Unique constraint error:", error.fields);
      }
      return res.status(500).json({ errors: "Interlnal Error." });
    }
  }
);

router.post("/user/signin", schemaValidator("/auth/user/signup"));

export default router;
