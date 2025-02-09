import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import * as Yup from 'yup';
import { useNavigate, } from "react-router";
import { toast } from "react-toastify";
import { useUpdateArtistMutation } from "./artistApi";

const valSchema = Yup.object({
  name: Yup.string().required(),
  dob: Yup.string().required(),
  gender: Yup.string().required(),
  address: Yup.string().required(),
  first_release_year: Yup.number().required(),
  no_of_albums_released: Yup.number().required(),
});



const ArtistUpdateForm = ({ user, token }) => {

  const [updateUser, { isLoading }] = useUpdateArtistMutation();
  const nav = useNavigate();



  return (
    <div className="px-4 max-w-[500px] mx-auto mt-[3%]">

      <Formik
        initialValues={{
          name: user?.name,
          dob: user?.dob,
          gender: user?.gender,
          address: user?.address,
          first_release_year: user?.first_release_year,
          no_of_albums_released: user?.no_of_albums_released,
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
                Artist Profile Update
              </Typography>


              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">

                <div className="space-y-6">
                  <div>
                    <Input
                      name="name"
                      onChange={handleChange}
                      type="text"
                      value={values.name}
                      label="Artist Name" />
                    {errors.name && touched.name && <h1 className="text-red-700 text-sm">{errors.name}</h1>}
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
                      name="first_release_year"
                      onChange={handleChange}
                      type="number"
                      value={values.first_release_year}
                      label="First Release Year" />
                    {errors.first_release_year && touched.first_release_year && <h1 className="text-red-700 text-sm">{errors.first_release_year}</h1>}
                  </div>
                  <div>
                    <Input
                      name="no_of_albums_released"
                      onChange={handleChange}
                      type="number"
                      value={values.no_of_albums_released}
                      label="No of Albums Released" />
                    {errors.no_of_albums_released && touched.no_of_albums_released && <h1 className="text-red-700 text-sm">{errors.no_of_albums_released}</h1>}
                  </div>


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
export default ArtistUpdateForm