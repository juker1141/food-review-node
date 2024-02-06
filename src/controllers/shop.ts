import { Response } from "express";
import { Op } from "sequelize";

import { CustomJWTRequest } from "@/middleware/authMiddleware";

import Shop from "@/models/shop.model";
import { replaceImageUrl } from "@/util/file";
import { handleSequelizeError, notFoundError } from "@/util/error";

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

  const offset = (parsePage - 1) * parsePageSize;

  let condition = {};

  if (keyword) {
    condition = {
      where: {
        title: {
          [Op.like]: `%${req.body.keyword}%`,
        },
      },
    };
  }

  try {
    const shops = await Shop.findAll({
      ...condition,
      limit: parsePageSize,
      offset: offset,
    });

    const count = await Shop.count({
      ...condition,
    });

    return res.status(200).json({ count, data: shops });
  } catch (err: any) {
    return handleSequelizeError(res, err);
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

    const shop = await Shop.create({
      title,
      url,
      imageUrl,
    });
    return res.status(200).json({ status: "success", data: shop });
  } catch (err: any) {
    handleSequelizeError(res, err);
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
    const shopToUpdate = await Shop.findByPk(shopId);

    if (!shopToUpdate) {
      return res.status(404).json({ errors: notFoundError });
    }

    if (title) shopToUpdate.title = title;

    if (url) shopToUpdate.url = url;

    if (req.file) {
      shopToUpdate.imageUrl = replaceImageUrl(req.file?.path);
    }

    const updatedShop = await shopToUpdate.save();
    return res.status(200).json({
      status: "success",
      data: updatedShop,
    });
  } catch (err: any) {
    handleSequelizeError(res, err);
  }
};
