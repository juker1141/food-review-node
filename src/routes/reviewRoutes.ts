import path from "path";
import fs from "fs";
import express, { Request, Response } from "express";

import multer from "multer";

import schemaValidator from "@/middleware/schemaValidator";
import authMiddleware from "@/middleware/authMiddleware";

import { createReview } from "@/controllers/review";

import { getStorageConfig } from "@/util/file";

const upload = multer({ storage: getStorageConfig("public/images/review") });

const router = express.Router();

router.post(
  "/review",
  authMiddleware,
  upload.single("image"),
  schemaValidator("/auth/review"),
  createReview
);

export default router;
