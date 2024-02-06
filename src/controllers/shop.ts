import { Request, Response } from "express";
import { Op } from "sequelize";

import Shop from "../models/shop.model";
import { handleSequelizeError } from "../util/error";
import { request } from "http";

type QueryParams = {
  page: number;
  pageSize?: number;
};

type ReqGetShopsBody = {
  keyword?: string;
};

export const getShops = async (
  req: Request<{}, {}, ReqGetShopsBody, QueryParams>,
  res: Response
) => {
  const { page, pageSize } = req.query;
  const { keyword } = req.body;

  // 如果沒有給一頁的總數，預設為10筆
  const actualPageSize = pageSize || 10;

  const offset = (page - 1) * actualPageSize;

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
      limit: actualPageSize,
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

type UpdateParams = {
  id: string;
};

type ReqUpdateShopBody = {};

export const updateShop = async (req: Request<UpdateParams>, res: Response) => {
  const shopId = req.params.id;
};
