import { Button, IconButton, Input, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { useNavigate } from "react-router";
import { useUserLoginMutation } from "./userApi";
import { toast } from "react-toastify";
import { addUser } from "./authSlice";
import { useState } from "react";


const valSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(5).max(100).required(),
});



const Login = () => {
  const [loginUser, { isLoading }] = useUserLoginMutation();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  return (
    <div className="px-4 max-w-[400px] mx-auto mt-[7%]">

      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={async (val) => {
          try {
            const response = await loginUser(val).unwrap();
            dispatch(addUser(response.data));
            // nav(-1);
            toast.success('Login Successfully');
          } catch (err) {
            toast.dismiss();
            toast.error(err.data?.message);
          }

        }}
        validationSchema={valSchema}
      >

        {
          ({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="">
              <Typography variant="h4" color="blue-gray">
                Log in to System
              </Typography>
              <Typography color="gray" className="mt-1 font-normal mb-6">
                Nice to meet you! Enter your details to Login.
              </Typography>
              <div className="space-y-6">
                <div>
                  <Input
                    name="email"
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    label="Email" />

                  {errors.email && touched.email && <h1 className="text-red-700 text-sm">{errors.email}</h1>}
                </div>
                <div className="relative flex w-full max-w-[24rem]">
                  <Input
                    name="password"
                    onChange={handleChange}
                    type={show ? "text" : "password"}
                    value={values.password}
                    label="Password"
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                  <IconButton onClick={() => setShow(!show)} variant="text"
                    className="!absolute right-1  rounded" >
                    <i className={show ? "fa fa-unlock" : "fa fa-lock"} />
                  </IconButton>

                </div>


                <div className="w-full">
                  <Button
                    loading={isLoading}
                    type="submit" size="sm" className="w-full py-[10px] flex justify-center ">Submit</Button>
                </div>



              </div>

              <Typography color="gray" className="mt-6 text-center font-normal ">
                Don't have an account ?
                <Button onClick={() => nav('/register')} variant="text" className="px-2 py-2">Sign Up</Button>
              </Typography>

            </form>
          )
        }


      </Formik>





    </div>
  )
}
export default Login