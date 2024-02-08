import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  errorFormat: "pretty",
});

import { CustomJWTRequest } from "@/middleware/authMiddleware";

import { replaceImageUrl } from "@/util/file";
import { handlePrismaError, notFoundError } from "@/util/error";

interface GetShopsRequest extends CustomJWTRequest {
  query: {
    page: string;
    pageSize?: string;
  };
  body: {
    keyword?: string;
  };
}

export const getShops = async (req: GetShopsRequest, res: Response) => {
  const { page, pageSize } = req.query;
  const { keyword } = req.body;

  const parsePage = parseInt(page, 10);
  // 如果沒有給一頁的總數，預設為10筆
  const parsePageSize = pageSize ? parseInt(pageSize, 10) : 10;

  const skip = (parsePage - 1) * parsePageSize;

  let condition = {};

  if (keyword) {
    condition = {
      where: {
        title: {
          contains: keyword,
        },
      },
    };
  }

  try {
    const shops = await prisma.shop.findMany({
      ...condition,
      skip,
      take: parsePageSize,
    });

    const count = await prisma.shop.count({
      ...condition,
    });

    return res.status(200).json({ count, data: shops });
  } catch (err: any) {
    return handlePrismaError(res, err);
  }
};

interface CreateShopRequest extends CustomJWTRequest {
  body: {
    title: string;
    url: string;
  };
  file?: Express.Multer.File;
}

export const createShop = async (req: CreateShopRequest, res: Response) => {
  const { title, url } = req.body;

  try {
    let imageUrl = "";
    if (req.file) {
      imageUrl = replaceImageUrl(req.file?.path);
    }

    const shop = await prisma.shop.create({
      data: {
        title,
        url,
        image: imageUrl,
      },
    });
    return res.status(200).json({ status: "success", data: shop });
  } catch (err: any) {
    handlePrismaError(res, err);
  }
};

interface UpdateShopRequest extends CustomJWTRequest {
  params: {
    id: string;
  };
  body: {
    title?: string;
    url?: string;
  };
  file?: Express.Multer.File;
}

export const updateShop = async (req: UpdateShopRequest, res: Response) => {
  const shopId = req.params.id;

  const { title, url } = req.body;

  try {
    const updateData: {
      title?: string;
      url?: string;
      image?: string;
    } = {};

    if (title) updateData.title = title;

    if (url) updateData.url = url;

    if (req.file) {
      updateData.image = replaceImageUrl(req.file?.path);
    }

    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: updateData,
    });
    return res.status(200).json({
      status: "success",
      data: updatedShop,
    });
  } catch (err: any) {
    handlePrismaError(res, err);
  }
};
