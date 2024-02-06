import Joi from "joi";

export const authSignup = Joi.object().keys({
  username: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/i)
    .required(),
  account: Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9]+$/i)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const authSignin = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required(),
});

export const authUpdateUser = Joi.object().keys({
  username: Joi.string().pattern(/^[a-zA-Z\s]+$/i),
  oldPassword: Joi.string().min(8),
  newPassword: Joi.string().when("oldPassword", {
    is: Joi.exist(),
    then: Joi.string().min(8).invalid(Joi.ref("oldPassword")).required(),
    otherwise: Joi.optional(),
  }),
});
