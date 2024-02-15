import request from "supertest";
import { Shop } from "@prisma/client";

import app from "@/app";
import {
  randomString,
  randomId,
  randomAccount,
  randomEmail,
} from "@/util/random";

const createRandomShop = (): Shop => {
  return {
    id: randomId(),
    title: randomString(6),
    url: randomString(24),
    image: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteById: null,
  };
};

describe("Test the get shop", () => {
  test("success", async () => {
    const shop = createRandomShop();

    const response = await request(app).post("/shop?page=1&pageSize=5");
    //   .expect((response) => {
    //     console.log(response);
    //   });
    // console.log(response);
    // expect(response.statusCode).toBe(200);
  });
});
