import Joi, { ObjectSchema } from "joi";

const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authSignup = Joi.object().keys({
  username: Joi.string().required(),
  account: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  // password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required(),
});

const authSignin = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  "/auth/user/signin": authSignin,
  "/auth/user/signup": authSignup,
} as { [key: string]: ObjectSchema };
