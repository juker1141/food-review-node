import { Request, Response } from "express";
import { Op } from "sequelize";

import jwt, { JwtPayload } from "jsonwebtoken";

import { CustomRequest } from "../middleware/authMiddleware";

import User from "../models/user.model";
import { hashedPassword, checkPassword } from "../util/password";
import {
  internalError,
  authError,
  notFoundError,
  handleSequelizeError,
  authForbiddenError,
} from "../util/error";

export type ResponseUser = {
  id: number;
  username: string;
  account: string;
  email: string;
  userImage: string;
  createdAt: Date;
  updatedAt: Date;
};

const getResponseUser = (user: User): ResponseUser => {
  const data = user.dataValues;
  return {
    id: data.id,
    username: data.username,
    account: data.account,
    email: data.email,
    userImage: data.userImage,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

type ReqCreateUserBody = {
  username: string;
  account: string;
  email: string;
  password: string;
  confirmPassword: string;
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
      return res.status(404).json({ errors: notFoundError });
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

    const accessToken = jwt.sign({ user: getResponseUser(user) }, jwtSecret, {
      expiresIn: "30m",
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
  const tokenUser = (req as CustomRequest).user as ResponseUser;
  if (!tokenUser) {
    return res.status(401).json({ errors: authError });
  }

  const user = await User.findByPk(tokenUser.id);

  if (!user) {
    return res.status(404).json({ errors: notFoundError });
  }

  res.status(200).json({
    status: "success",
    data: getResponseUser(user),
  });
};

// type ReqUpdateUserParams = {
//   id: string;
// };

// type ReqUpdateUserBody = {
//   username?: string;
//   oldPassword?: string;
//   newPassword?: string;
// };

// export const updateUser = async (
//   req: Request<{}, {}, ReqUpdateUserBody>,
//   res: Response
// ) => {
//   const userId = req.params.id;
//   const tokenUser = (req as CustomRequest).user as ResponseUser;

//   if (!tokenUser) {
//     return res.status(401).json({ errors: authError });
//   }

//   if (parseInt(userId, 10) !== tokenUser.id) {
//     return res.status(403).json({ errors: authForbiddenError });
//   }

//   const userToUpdate = await User.findByPk(tokenUser.id);

//   if (!userToUpdate) {
//     return res.status(404).json({ errors: notFoundError });
//   }

//   const { username } = req.body;

//   // 更新用户实例的属性
//   userToUpdate.username = username;
//   userToUpdate.email = email;

//   res.status(200).json({
//     status: "success",
//     data: getResponseUser(user),
//   });
// };
