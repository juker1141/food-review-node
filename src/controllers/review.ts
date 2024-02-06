import { Response } from "express";
import { Op } from "sequelize";

import { CustomJWTRequest } from "@/middleware/authMiddleware";
import Shop from "@/models/shop.model";
import Review from "@/models/review.model";
import {
  internalError,
  handleSequelizeError,
  authForbiddenError,
} from "@/util/error";
import { replaceImageUrl } from "@/util/file";

interface CreateReviewBody {
  shopId?: number;
  shopTitle?: string;
  shopUrl?: string;
  rating: number;
  title: string;
  content: string;
}

interface createReviewRequest extends CustomJWTRequest {
  body: CreateReviewBody;
  file?: Express.Multer.File;
}

export const createReview = async (req: createReviewRequest, res: Response) => {
  const tokenUser = req.user;

  if (!tokenUser) {
    return res.status(403).json({ errors: authForbiddenError });
  }

  const { shopTitle, shopUrl, shopId, rating, title, content } = req.body;

  try {
    let shop: Shop | null;

    if (shopId) {
      shop = await Shop.findByPk(shopId);
    } else {
      shop = await Shop.findOne({
        where: {
          [Op.or]: [{ title: shopTitle }, { url: shopUrl }],
        },
      });
    }

    if (!shop && !shopId && shopTitle && shopUrl) {
      shop = await Shop.create({
        title: shopTitle,
        url: shopUrl,
        imageUrl: "",
      });
    }

    if (!shop) {
      return res.status(500).json({ erros: internalError });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = replaceImageUrl(req.file?.path);
    }

    const review = await Review.create({
      userId: tokenUser.id,
      shopId: shopId || shop?.id,
      rating,
      imageUrl,
      title,
      content,
    });
    return res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (err: any) {
    return handleSequelizeError(res, err);
  }
};
