import Joi from "joi";

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const musicSchema = Joi.object({
  artist_id: Joi.number().required(),
  title: Joi.string().required(),
  album_name: Joi.string().required(),
  genre: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.number().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string(),
});

const artistSchema = Joi.object({
  name: Joi.string().required(),
  dob: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  first_release_year: Joi.number().required(),
  no_of_albums_released: Joi.number().required(),
  user_id: Joi.number().required(),
});

export const validateMusic = validator(musicSchema);
export const validateLogin = validator(loginSchema);
export const validateRegister = validator(registerSchema);
export const validateArtist = validator(artistSchema);