import * as Yup from "yup";


export const registerchema = Yup.object({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  phone: Yup.string().min(10).max(10).required(),
  dob: Yup.string().required(),
  gender: Yup.string().required(),
  address: Yup.string().required(),
  role: Yup.string().required(),
});
