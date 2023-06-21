import Joi from 'joi'
const emailSchema = Joi.string().email()
const usernameschema = Joi.string().min(3).max(16)
const passwordSchema = Joi.string().min(6).max(20)
const addressSchema = Joi.string()
const tokenSchema = Joi.string()
const idSchema = Joi.number()
const titleSchema = Joi.string().min(3)
const descriptionSchema = Joi.string().min(6)
const postedBySchema = Joi.string()
const pidSchema = Joi.number()
const userIdSchema = Joi.number()
const cidSchema = Joi.number()
const searchquerySchema = Joi.string()
const locationSchema = Joi.string()
const heritageSchema = Joi.string()
const placesToVisitSchema = Joi.string()
const communityAccessSchema = Joi.string()
const easeOfTransportationSchema = Joi.string()
const safetySchema = Joi.string()
const costSchema = Joi.string()
const pageSchema = Joi.number()
const textSchema = Joi.string()
// const limitSchema = Joi.number()
export const loginValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required(),
  }).validate(data)
export const updateprofilepicvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    id: idSchema.required(),
  }).validate(data)
export const createpostValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    title: titleSchema.required(),
    description: descriptionSchema.required(),
    postedBy: postedBySchema.required(),
    location: locationSchema.required(),
    easeOfTransportation: easeOfTransportationSchema,
    safety: safetySchema,
    cost: costSchema.required(),
    heritage: heritageSchema,
    placesToVisit: placesToVisitSchema,
    communityAccess: communityAccessSchema,
  }).validate(data)
export const searchuservalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    query: searchquerySchema.required(),
  }).validate(data)
export const likeunlikepostvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    pid: pidSchema.required(),
    userId: userIdSchema.required(),
  }).validate(data)
export const addcommentvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    pid: pidSchema.required(),
    text: textSchema.required(),
    userId: userIdSchema.required(),
  }).validate(data)
export const deletepostvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    pid: pidSchema.required(),
  }).validate(data)
export const likescountvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    pid: pidSchema.required(),
  }).validate(data)
export const getuserpostvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    userId: userIdSchema.required(),
    page: pageSchema.required(),
    // limit: limitSchema.required(),
  }).validate(data)
  export const getpostdetailsvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    postId: pidSchema.required(),
  }).validate(data)
export const getcommentvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    postId: pidSchema.required(),
  }).validate(data)
export const getlikesvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    postId: pidSchema.required(),
  }).validate(data)
export const deleteeditcommentvalidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    cid: cidSchema.required(),
  }).validate(data)
export const resetPasswordValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    password: passwordSchema.required(),
    email: emailSchema.required(),
    token: tokenSchema.required(),
    id: idSchema.required(),
  }).validate(data)
export const signUpVerificationValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    token: tokenSchema.required(),
    id: idSchema.required(),
  }).validate(data)
export const forgotPasswordValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    email: emailSchema.required(),
  }).validate(data)
export const signUpValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    name: usernameschema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    address: addressSchema.required(),
  }).validate(data)
export const getUserValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    userId: userIdSchema.required(),
  }).validate(data)
