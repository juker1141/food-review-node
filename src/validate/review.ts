import Joi from "joi";

export const authCreateReview = Joi.object().keys({
  shopId: Joi.string(),
  shopTitle: Joi.string().when("shopId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  shopUrl: Joi.string().uri().when("shopId", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  rating: Joi.number().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});
