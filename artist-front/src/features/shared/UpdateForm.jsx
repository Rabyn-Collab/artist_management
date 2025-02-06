import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";
import { useUpdateUserMutation } from "../auth/userApi";



const valSchema = Yup.object({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().required(),
  phone: Yup.string().required(),
  dob: Yup.string().required(),
  gender: Yup.string().required(),
  address: Yup.string().required(),
  role: Yup.string().required(),
});



const UpdateForm = ({ user, token }) => {

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const nav = useNavigate();

  return (
    <div className="px-4 max-w-[500px] mx-auto mt-[3%]">

      <Formik
        initialValues={{
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          phone: user?.phone,
          dob: user?.dob,
          gender: user?.gender,
          address: user?.address,
          role: user?.role
        }}
        onSubmit={async (val) => {
          try {

            await updateUser({
              token,
              id: user.id,
              body: val
            }).unwrap();
            toast.success('Profile Update Successfully');
            nav(-1);
          } catch (err) {

            toast.error(err.data?.message);
          }
        }}
        validationSchema={valSchema}
      >


        {
          ({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} >
              <Typography variant="h4" color="blue-gray" className="mb-6">
                Profile Update
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
                      value={values.gender}
                      name="gender"
                      onChange={(e) => setFieldValue("gender", e)}
                      label="Select Gender">
                      <Option value="m">Male</Option>
                      <Option value="f">Female</Option>
                      <Option value="o">Other</Option>
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
                    <Input
                      name="dob"
                      onChange={handleChange}
                      type="date"
                      value={values.dob ? values.dob.split("T")[0] : ""} // Ensure YYYY-MM-DD format
                      label="Date of Birth"
                    />
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

                  {user?.role === "super_admin" && <div>
                    <Select
                      value={values.role}
                      name="role"
                      onChange={(e) => setFieldValue("role", e)}
                      label="Select Role">
                      <Option value="super_admin">Super Admin</Option>
                      <Option value="artist_manager">Artist Manager</Option>
                      <Option value="artist">Artist</Option>
                    </Select>
                    {errors.role && touched.role && <h1 className="text-red-700 text-sm">{errors.role}</h1>}
                  </div>

                  }



                </div>




              </div>

              <div className="col-span-2 sm:px-0 px-14 mt-8">
                <Button loading={isLoading} type="submit" size="sm" className="w-full py-[10px] ">Submit</Button>
              </div>

            </form>
          )
        }


      </Formik>





    </div>
  )
}
export default UpdateForm