import Joi from "joi";

export const authCreateReview = Joi.object().keys({
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
