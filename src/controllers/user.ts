import { Request, Response } from "express";
import { Op } from "sequelize";

import jwt from "jsonwebtoken";

import { CustomJWTRequest } from "@/middleware/authMiddleware";

import User from "@/models/user.model";
import { hashedPassword, checkPassword } from "@/util/password";
import {
  internalError,
  authError,
  notFoundError,
  handleSequelizeError,
  authForbiddenError,
} from "@/util/error";

export interface ResponseUser {
  id: number;
  username: string;
  account: string;
  email: string;
  userImage: string;
  createdAt: Date;
  updatedAt: Date;
}

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

interface CreateUserRequest extends Request {
  body: {
    username: string;
    account: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export const createUser = async (req: CreateUserRequest, res: Response) => {
  try {
    const hashedPw = hashedPassword(req.body.password);

    const user = await User.create({
      username: req.body.username,
      account: req.body.account,
      userImage: "images/avatar/default_avatar.png",
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

interface SignInRequest extends Request {
  body: {
    account: string;
    password: string;
  };
}

export const signIn = async (req: SignInRequest, res: Response) => {
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
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      data: { accessToken: accessToken },
    });
  } catch (err: any) {
    return handleSequelizeError(res, err);
  }
};

export const getUserByToken = async (req: CustomJWTRequest, res: Response) => {
  const tokenUser = req.user;
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

interface UpdateUserRequest extends CustomJWTRequest {
  body: {
    username?: string;
    oldPassword?: string;
    newPassword?: string;
  };
  params: {
    id: string;
  };
  file?: Express.Multer.File;
}

export const updateUserByToken = async (
  req: UpdateUserRequest,
  res: Response
) => {
  const userId = req.params.id;
  const tokenUser = req.user;

  if (!tokenUser) {
    return res.status(401).json({ errors: authError });
  }

  if (parseInt(userId, 10) !== tokenUser.id) {
    console.log(parseInt(userId, 10), tokenUser.id);
    return res.status(403).json({ errors: authForbiddenError });
  }
  try {
    const userToUpdate = await User.findByPk(tokenUser.id);

    if (!userToUpdate) {
      return res.status(404).json({ errors: notFoundError });
    }

    const { username, oldPassword, newPassword } = req.body;

    if (username) {
      userToUpdate.username = username;
    }

    if (req.file) {
      const imageUrl = req.file.path.replace("public/", "") || "";
      userToUpdate.userImage = imageUrl;
    }

    if (oldPassword && newPassword) {
      const isVerify = checkPassword(oldPassword, userToUpdate.hashedPassword);
      if (!isVerify) {
        return res.status(403).json({
          errors: authForbiddenError,
        });
      }

      const hashedPw = hashedPassword(newPassword);
      userToUpdate.hashedPassword = hashedPw;
    }

    const updatedUser = await userToUpdate.save();

    res.status(200).json({
      status: "success",
      data: getResponseUser(updatedUser),
    });
  } catch (err: any) {
    return handleSequelizeError(res, err);
  }
};
