import request, { Response } from "supertest";
import { User } from "@prisma/client";

import app from "@/app";
import type { CreateUserReqBody } from "@/controllers/user";
import { getResponseUser } from "@/controllers/user";
import { randomString, randomAccount, randomEmail } from "@/util/random";

const createRandomUser = (): { user: User; password: string } => {
  const password = randomString(8);

  const user = {
    id: randomString(16),
    username: randomString(8),
    account: randomAccount(8),
    hashedPassword: password,
    email: randomEmail(),
    image: randomString(12),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    user,
    password,
  };
};

describe("Test the signup user", () => {
  const { user, password } = createRandomUser();

  const responseUser = getResponseUser(user);

  const testUserBody: CreateUserReqBody = {
    username: user.username,
    account: user.account,
    email: user.email,
    password: password,
    confirmPassword: password,
  };

  const testCases = [
    {
      case: "success",
      body: testUserBody,
      validate: (response: Response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toHaveProperty("username", user.username);
        expect(response.body.data).toHaveProperty("account", user.account);
        expect(response.body.data).toHaveProperty("email", user.email);
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).not.toHaveProperty("hashedPassword");
      },
    },
    {
      case: "internal error",
      body: testUserBody,
      validate: (response: Response) => {
        expect(response.statusCode).toBe(500);
      },
    },
    {
      case: "validate failed with username",
      body: { ...testUserBody, username: "test1234" },
      validate: (response: Response) => {
        expect(response.statusCode).toBe(422);
      },
    },
    {
      case: "validate failed with account",
      body: { ...testUserBody, account: "test account" },
      validate: (response: Response) => {
        expect(response.statusCode).toBe(422);
      },
    },
    {
      case: "validate failed with wrong confirmPassword",
      body: { ...testUserBody, confirmPassword: "password" },
      validate: (response: Response) => {
        expect(response.statusCode).toBe(422);
      },
    },
  ];

  testCases.forEach(async (tc: any) => {
    beforeEach(() => {
      // Mock PrismaClient to simulate database errors only for this specific test case
      if (tc.case === "internal error") {
        jest.mock("@prisma/client", () => ({
          PrismaClient: jest.fn(() => ({
            user: {
              create: jest
                .fn()
                .mockRejectedValue(new Error("Prisma operation failed.")),
            },
          })),
        }));
      }
    });

    afterEach(() => {
      // Reset the mock after each test case
      jest.resetModules();
    });
    test(tc.case, async () => {
      const response = await request(app).post("/user/signup").send(tc.body);

      tc.validate(response);
    });
  });
});
