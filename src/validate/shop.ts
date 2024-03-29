import Joi from "joi";

export const authCreateShop = Joi.object().keys({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
});

export const authUpdateShop = Joi.object().keys({
  title: Joi.string(),
  url: Joi.string().uri(),
});
