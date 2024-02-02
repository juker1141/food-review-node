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
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

const authSignin = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  "/auth/user/signup": authSignup,
  "/auth/user/signin": authSignin,
} as { [key: string]: ObjectSchema };
