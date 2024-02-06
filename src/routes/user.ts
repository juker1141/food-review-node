import path from "path";
import fs from "fs";
import express from "express";

import multer from "multer";

import schemaValidator from "../middleware/schemaValidator";
import authMiddleware from "../middleware/authMiddleware";

import {
  createUser,
  signIn,
  getUserByToken,
  updateUserByToken,
} from "../controllers/user";

import { getStorageConfig } from "../util/file";

const upload = multer({ storage: getStorageConfig("public/images/avatar") });

const router = express.Router();

router.post("/user/signup", schemaValidator("/auth/user/signup"), createUser);

router.post("/user/signin", schemaValidator("/auth/user/signin"), signIn);

router.get("/user", authMiddleware, getUserByToken);

router.patch(
  "/user/:id",
  authMiddleware,
  upload.single("image"),
  schemaValidator("/auth/user/update"),
  updateUserByToken
);

export default router;
