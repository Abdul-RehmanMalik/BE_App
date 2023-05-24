import Joi from "joi";
const emailSchema = Joi.string().email();
const usernameschema = Joi.string().min(3).max(16);
const passwordSchema = Joi.string().min(6).max(20);
const addressSchema = Joi.string();
const tokenSchema = Joi.string();
const idSchema = Joi.number();
export const loginValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required(),
  }).validate(data);
  export const resetPasswordValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    password: passwordSchema.required(),
    email: emailSchema.required(),
    token: tokenSchema.required(),
    id: idSchema.required(),
  }).validate(data);
  export const forgotPasswordValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    email: emailSchema.required()
  }).validate(data);
export const signUpValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    name: usernameschema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    address: addressSchema.required(),
  }).validate(data);
export const getUserValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    username: usernameschema.required(),
  }).validate(data);
