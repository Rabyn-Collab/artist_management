import { Button, Input, Option, Select, Typography } from "@material-tailwind/react"
import { Formik } from "formik"
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useUpdateSongMutation } from "./songApi";



const valSchema = Yup.object({
  title: Yup.string().required(),
  album_name: Yup.string().required(),
  genre: Yup.string().required(),
});



const SongEditForm = ({ song }) => {
  const [updateSong, { isLoading }] = useUpdateSongMutation();
  const { user } = useSelector(state => state.userSlice);

  const nav = useNavigate();

  return (
    <div className="px-4 max-w-[400px] mx-auto mt-[5%]">

      <Formik
        initialValues={{
          title: song?.title || '',
          album_name: song?.album_name || '',
          genre: song?.genre || '',
        }}
        onSubmit={async (val) => {
          try {
            await updateSong({
              id: song.id,
              token: user.token,
              body: val
            }).unwrap();
            toast.success('Song Created Successfully');
            nav(-1);
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
              <Typography variant="h4" color="blue-gray" className="mb-6">
                Update Song
              </Typography>

              <div className="space-y-6">
                <div>
                  <Input
                    name="title"
                    onChange={handleChange}
                    type="text"
                    value={values.title}
                    label="Title" />

                  {errors.title && touched.title && <h1 className="text-red-700 text-sm">{errors.title}</h1>}
                </div>
                <div>
                  <Input
                    name="album_name"
                    onChange={handleChange}
                    type="text"
                    value={values.album_name}
                    label="Album Name" />

                  {errors.album_name && touched.album_name && <h1 className="text-red-700 text-sm">{errors.album_name}</h1>}
                </div>

                <div>
                  <Select
                    value={values.genre}
                    name="genre"
                    onChange={(e) => setFieldValue("genre", e)}
                    label="Select Genre">
                    <Option value="rnb">RnB</Option>
                    <Option value="country">Country</Option>
                    <Option value="classic">Classic</Option>
                    <Option value="rock">Rock</Option>
                    <Option value="jazz">Jazz</Option>
                  </Select>

                  {errors.genre && touched.genre && <h1 className="text-red-700 text-sm">{errors.genre}</h1>}
                </div>




                <div className="w-full">
                  <Button
                    loading={isLoading}
                    type="submit" size="sm" className="w-full py-[10px] flex justify-center ">Submit</Button>
                </div>



              </div>


            </form>
          )
        }


      </Formik>





    </div >
  )
}
export default SongEditForm