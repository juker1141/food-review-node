import path from "path";
import fs from "fs";
import express, { Request, Response } from "express";

import multer from "multer";

import schemaValidator from "../middleware/schemaValidator";
import authMiddleware from "../middleware/authMiddleware";

import { getShops, updateShop } from "../controllers/shop";

import { getStorageConfig } from "../util/file";

const upload = multer({ storage: getStorageConfig("public/images/shop") });

const router = express.Router();

router.get("/shops", authMiddleware, getShops);

router.patch(
  "/shop/:id",
  authMiddleware,
  upload.single("image"),
  schemaValidator("/auth/shop/update"),
  updateShop
);

export default router;
