import request from "supertest";

import app from "@/app";

describe("Test the root ping path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/ping");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("pong");
  });
});
