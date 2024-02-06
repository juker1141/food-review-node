import Joi, { ObjectSchema } from "joi";

const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authSignup = Joi.object().keys({
  username: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/i)
    .required(),
  account: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]+$/i)
    .required(),
  email: Joi.string().email().required(),
  // password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const authSignin = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required(),
});

const authUpdateUser = Joi.object().keys({
  username: Joi.string().pattern(/^[a-zA-Z\s]+$/i),
  oldPassword: Joi.string().min(8),
  newPassword: Joi.string().when("oldPassword", {
    is: Joi.exist(),
    then: Joi.string().min(8).invalid(Joi.ref("oldPassword")).required(),
    otherwise: Joi.optional(),
  }),
});

const createReview = Joi.object().keys({
  shopId: Joi.number(),
  shopTitle: Joi.string().when("shopId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  shopUrl: Joi.string().when("shopId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  rating: Joi.number().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export default {
  "/auth/user/signup": authSignup,
  "/auth/user/signin": authSignin,
  "/auth/user/update": authUpdateUser,
  "/auth/review": createReview,
} as { [key: string]: ObjectSchema };
