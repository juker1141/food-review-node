import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient({
  errorFormat: "pretty",
});

import jwt from "jsonwebtoken";

import { CustomJWTRequest } from "@/middleware/authMiddleware";

import { hashedPassword, checkPassword } from "@/util/password";
import {
  internalError,
  authError,
  notFoundError,
  handlePrismaError,
  authForbiddenError,
} from "@/util/error";
import { replaceImageUrl } from "@/util/file";

export interface ResponseUser {
  id: string;
  username: string;
  account: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const getResponseUser = (user: User): ResponseUser => {
  return {
    id: user.id,
    username: user.username,
    account: user.account,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
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

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        account: req.body.account,
        image: "images/avatar/default_avatar.png",
        email: req.body.email,
        hashedPassword: hashedPw,
      },
    });

    return res.status(201).json({
      status: "success",
      data: getResponseUser(user),
    });
  } catch (err: any) {
    return handlePrismaError(res, err);
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
    let user: User | null;

    if (account.includes("@")) {
      user = await prisma.user.findUnique({
        where: {
          email: account,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: {
          account: account,
        },
      });
    }

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
    return handlePrismaError(res, err);
  }
};

export const getUserByToken = async (req: CustomJWTRequest, res: Response) => {
  const tokenUser = req.user;
  if (!tokenUser) {
    return res.status(401).json({ errors: authError });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: tokenUser.id },
    });

    if (!user) {
      return res.status(404).json({ errors: notFoundError });
    }

    res.status(200).json({
      status: "success",
      data: getResponseUser(user),
    });
  } catch (err: any) {
    return handlePrismaError(res, err);
  }
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

  if (userId !== tokenUser.id) {
    return res.status(403).json({ errors: authForbiddenError });
  }
  try {
    const { username, oldPassword, newPassword } = req.body;

    const updateData: {
      username?: string;
      hashedPassword?: string;
      image?: string;
    } = {};

    if (username) {
      updateData.username = username;
    }

    if (req.file) {
      const imageUrl = replaceImageUrl(req.file.path);
      updateData.image = imageUrl;
    }

    if (oldPassword && newPassword) {
      const oldUser = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const isVerify = checkPassword(oldPassword, oldUser.hashedPassword);
      if (!isVerify) {
        return res.status(403).json({
          errors: authForbiddenError,
        });
      }

      const hashedPw = hashedPassword(newPassword);
      updateData.hashedPassword = hashedPw;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: tokenUser.id,
      },
      data: updateData,
    });

    if (!updatedUser) {
      return res.status(404).json({ errors: notFoundError });
    }

    res.status(200).json({
      status: "success",
      data: getResponseUser(updatedUser),
    });
  } catch (err: any) {
    console.log(err);
    return handlePrismaError(res, err);
  }
};
