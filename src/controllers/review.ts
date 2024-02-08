import { Response } from "express";
import { PrismaClient, Shop } from "@prisma/client";
const prisma = new PrismaClient({
  errorFormat: "pretty",
});

import { CustomJWTRequest } from "@/middleware/authMiddleware";
import {
  internalError,
  handlePrismaError,
  authForbiddenError,
} from "@/util/error";
import { replaceImageUrl } from "@/util/file";

interface CreateReviewBody {
  shopId?: string;
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
    let shop: Shop | null = null;

    if (shopId) {
      shop = await prisma.shop.findUnique({
        where: {
          id: shopId,
        },
      });
    } else if (shopTitle && shopUrl) {
      shop = await prisma.shop.findFirst({
        where: {
          OR: [
            { title: { contains: shopTitle } },
            { url: { contains: shopUrl } },
          ],
        },
      });
    }

    if (!shop && !shopId && shopTitle && shopUrl) {
      shop = await prisma.shop.create({
        data: {
          title: shopTitle,
          url: shopUrl,
          image: "",
        },
      });
    }

    if (!shop) {
      return res.status(500).json({ erros: internalError });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = replaceImageUrl(req.file?.path);
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: tokenUser.id,
        shopId: shopId || shop?.id,
        rating,
        image: imageUrl,
        title,
        content,
      },
    });

    return res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (err: any) {
    return handlePrismaError(res, err);
  }
};
