import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useLocation, useNavigate } from "react-router";
import { useUserRegisterMutation } from "./userApi";
import { toast } from "react-toastify";
import { useState } from "react";



const valSchema = Yup.object({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  phone: Yup.string().required(),
  dob: Yup.string().required(),
  gender: Yup.string().required(),
  address: Yup.string().required(),
  role: Yup.string().required(),
});



const Register = () => {
  const label = useLocation();
  const [userRegister, { isLoading }] = useUserRegisterMutation();
  const [show, setShow] = useState(false);
  const { user } = useSelector(state => state.userSlice);
  const nav = useNavigate();

  return (
    <div className="px-4 max-w-[500px] mx-auto mt-[2%]">

      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone: "",
          dob: "",
          gender: "",
          address: "",
          role: ""
        }}
        onSubmit={async (val) => {
          try {

            await userRegister(val).unwrap();
            toast.success('Register Successfully');
            nav(-1);
          } catch (err) {
            console.log(err);
            toast.error(err.data?.message);
          }
        }}
        validationSchema={valSchema}
      >

        {
          ({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="">
              <Typography variant="h4" color="blue-gray">
                Register to System
              </Typography>
              <Typography color="gray" className="mt-1 font-normal mb-6">
                Nice to meet you! Enter your details to Register.
              </Typography>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">

                <div className="space-y-6">
                  <div>
                    <Input
                      name="first_name"
                      onChange={handleChange}
                      type="text"
                      value={values.first_name}
                      label="First Name" />
                    {errors.first_name && touched.first_name && <h1 className="text-red-700 text-sm">{errors.first_name}</h1>}
                  </div>
                  <div>
                    <Input
                      name="email"
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      label="Email" />
                    {errors.email && touched.email && <h1 className="text-red-700 text-sm">{errors.email}</h1>}
                  </div>
                  <div>
                    <Input
                      name="phone"
                      onChange={handleChange}
                      type="number"
                      value={values.phone}
                      label="Phone" />
                    {errors.phone && touched.phone && <h1 className="text-red-700 text-sm">{errors.phone}</h1>}
                  </div>
                  <div>
                    <Select
                      name="gender"
                      onChange={(e) => setFieldValue("gender", e)}
                      label="Select Gender">
                      <Option value="m">Male</Option>
                      <Option value="f">Female</Option>
                      <Option value="o">Other</Option>
                    </Select>

                    {errors.gender && touched.gender && <h1 className="text-red-700 text-sm">{errors.gender}</h1>}
                  </div>
                  <div>
                    <Select
                      name="role"
                      onChange={(e) => setFieldValue("role", e)}
                      label="Select Role">
                      <Option value="super_admin">Super Admin</Option>
                      <Option value="artist_manager">Artist Manager</Option>
                      <Option value="artist">Artist</Option>
                    </Select>

                    {errors.gender && touched.gender && <h1 className="text-red-700 text-sm">{errors.gender}</h1>}
                  </div>
                </div>
                <div className="space-y-6">

                  <div>
                    <Input
                      name="last_name"
                      onChange={handleChange}
                      type="text"
                      value={values.last_name}
                      label="Last Name" />
                    {errors.last_name && touched.last_name && <h1 className="text-red-700 text-sm">{errors.last_name}</h1>}
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





                  <div>
                    <Input
                      name="dob"
                      onChange={handleChange}
                      type="date"
                      value={values.dob}
                      label="Date of Birth" />
                    {errors.dob && touched.dob && <h1 className="text-red-700 text-sm">{errors.dob}</h1>}
                  </div>
                  <div>
                    <Input
                      name="address"
                      onChange={handleChange}
                      type="text"
                      value={values.address}
                      label="Address" />
                    {errors.address && touched.address && <h1 className="text-red-700 text-sm">{errors.address}</h1>}
                  </div>

                </div>




              </div>

              <div className="w-full">
                <Button
                  loading={isLoading}
                  type="submit" size="sm" className="w-full py-[10px] flex justify-center mt-7 ">Submit</Button>
              </div>

              {/* <div className="col-span-2 sm:px-0 px-14 mt-8">
                <Button loading={isLoading} type="submit" size="sm" className="w-full py-[10px] ">Submit</Button>
              </div> */}

              {!user && <Typography color="gray" className="mt-6 text-center font-normal">
                Already have an account ?
                <Button onClick={() => nav(-1)} variant="text" className="px-2 py-2">Login</Button>
              </Typography>}

            </form>
          )
        }


      </Formik>





    </div>
  )
}
export default Register