import Joi, { ObjectSchema } from "joi";

import { authSignin, authSignup, authUpdateUser } from "@/validate/user";
import { authUpdateShop } from "@/validate/shop";
import { authCreateReview } from "@/validate/review";

export default {
  "/auth/user/signup": authSignup,
  "/auth/user/signin": authSignin,
  "/auth/user/update": authUpdateUser,

  "/auth/shop/update": authUpdateShop,

  "/auth/review": authCreateReview,
} as { [key: string]: ObjectSchema };
