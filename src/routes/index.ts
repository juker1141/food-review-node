import path from "path";
import express from "express";

import userRoutes from "@/routes/userRoutes";
import reviewRoutes from "@/routes/reviewRoutes";
import shopRoutes from "@/routes/shopRoutes";

const router = express.Router();

router.use("/static", express.static(path.join(__dirname, "../../public")));

router.use(userRoutes);
router.use(reviewRoutes);
router.use(shopRoutes);

export default router;
