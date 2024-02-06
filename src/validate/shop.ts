import Joi from "joi";

export const authUpdateShop = Joi.object().keys({
  title: Joi.string(),
  url: Joi.string(),
});
