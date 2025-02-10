import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useNavigate } from "react-router";
import { useUserRegisterMutation } from "./userApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { registerchema } from "../../utils/validator";





const AddUser = () => {
  const [userRegister, { isLoading }] = useUserRegisterMutation();
  const [show, setShow] = useState(false);
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
            toast.success('user added successfully');
            nav(-1);
          } catch (err) {
            toast.error(err.data?.message);
          }
        }}
        validationSchema={registerchema}
      >

        {
          ({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="">
              <Typography variant="h4" color="blue-gray">
                Add User
              </Typography>
              <Typography color="gray" className="mt-1 font-normal mb-6">
                Nice to meet you! Enter user details.
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

                  <div>
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
                    {errors.password && touched.password && <h1 className="text-red-700 text-sm">{errors.password}</h1>}
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





            </form>
          )
        }


      </Formik>





    </div>
  )
}
export default AddUser