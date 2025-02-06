import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ArtistSelect from "./ArtistSelect";
import { useGetAllAritstsUsersQuery } from "../auth/userApi";
import { useCreateArtistMutation } from "./artistApi";



const valSchema = Yup.object({
  user: Yup.mixed().required(),
  first_release_year: Yup.number().required(),
  no_of_albums_released: Yup.number().required(),
});



const ArtistForm = () => {
  const { user } = useSelector(state => state.userSlice);
  const { isLoading, data, error } = useGetAllAritstsUsersQuery(user.token);
  const [createArtist, { isLoading: arLoad }] = useCreateArtistMutation();
  const nav = useNavigate();

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }

  if (data?.length === 0) {
    return <div>
      <Typography className="text-center mt-[15%]">Artists Not Found </Typography>
    </div>
  }



  return (
    <div className="px-4 max-w-[400px] mx-auto mt-[2%]">

      <Formik
        initialValues={{
          user: null,
          first_release_year: '',
          no_of_albums_released: '',
        }}
        onSubmit={async (val) => {
          try {


            await createArtist({
              body: {
                name: val.user.first_name + ' ' + val.user.last_name,
                dob: val.user.dob,
                gender: val.user.gender,
                address: val.user.address,
                first_release_year: val.first_release_year,
                no_of_albums_released: val.no_of_albums_released,
                user_id: val.user.id
              },
              token: user.token
            }).unwrap();
            toast.success('artist created successfully');
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
                Add Artist
              </Typography>
              <Typography color="gray" className="mt-1 font-normal mb-6">
                Nice to meet you! Enter your details to Register.
              </Typography>

              <div className="">

                <div className="space-y-6">




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

                  <ArtistSelect users={data} setFieldValue={setFieldValue} values={values} errors={errors} touched={touched} />


                </div>





              </div>

              <div className="col-span-2 sm:px-0  mt-8">
                <Button loading={arLoad} type="submit" size="sm" className="w-full py-[10px] ">Submit</Button>
              </div>


            </form>
          )
        }


      </Formik>





    </div>
  )
}
export default ArtistForm