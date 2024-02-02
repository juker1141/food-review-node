import { Request, Response } from "express";
import { Op } from "sequelize";

import jwt, { JwtPayload } from "jsonwebtoken";

import { CustomRequest } from "../middleware/authMiddleware";

import User from "../models/user.model";
import { hashedPassword, checkPassword } from "../util/password";
import {
  internalError,
  authError,
  userNotFoundError,
  handleSequelizeError,
} from "../util/error";

type ReqCreateUserBody = {
  username: string;
  account: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const getResponseUser = (user: User) => {
  const data = user.dataValues;
  return {
    id: data.id,
    account: data.account,
    email: data.email,
    userImage: data.userImage,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const createUser = async (
  req: Request<{}, {}, ReqCreateUserBody>,
  res: Response
) => {
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
      data: getResponseUser(user),
    });
  } catch (err: any) {
    return handleSequelizeError(res, err);
  }
};

type ReqSignInBody = {
  account: string;
  password: string;
};

export const signIn = async (
  req: Request<{}, {}, ReqSignInBody>,
  res: Response
) => {
  const { account, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ account: account }, { email: account }],
      },
    });

    if (!user) {
      return res.status(404).json({ errors: userNotFoundError });
    }

    const isPwEqual = checkPassword(password, user.hashedPassword);
    if (!isPwEqual) {
      return res.status(401).json({
        errors: authError,
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        errors: internalError,
      });
    }

    const accessToken = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: "success",
      data: { accessToken: accessToken },
    });
  } catch (err: any) {
    return handleSequelizeError(res, err);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = (req as CustomRequest).userId;
  if (!userId) {
    return res.status(401).json({ errors: authError });
  }

  let user;

  if (typeof userId === "string") {
    // 如果userId是string类型，直接传递给findByPk
    user = await User.findByPk(userId);
  } else {
    const userIdFromPayload = (userId as JwtPayload).id;
    if (!userIdFromPayload) {
      return res.status(404).json({ errors: userNotFoundError });
    }
    user = await User.findByPk(userIdFromPayload);
  }
  if (!user) {
    return res.status(404).json({ errors: userNotFoundError });
  }

  res.status(200).json({
    status: "success",
    data: getResponseUser(user),
  });
};
