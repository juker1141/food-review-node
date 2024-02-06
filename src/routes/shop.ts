import path from "path";
import fs from "fs";
import express, { Request, Response } from "express";

import multer from "multer";

import schemaValidator from "../middleware/schemaValidator";
import { getShops } from "../controllers/shop";

import { getStorageConfig } from "../util/file";

const upload = multer({ storage: getStorageConfig("public/images/shop") });

const router = express.Router();

router.get("/shops", getShops);

export default router;
