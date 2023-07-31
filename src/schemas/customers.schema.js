import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().min(2).required(),
  phone: joi.string().pattern(new RegExp('^\\d{11}$')).required(),
  cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
  birthday: joi.date().max("now").iso().required(),
});
