import { Input } from '@material-tailwind/react'
import React from 'react'
import { useUploadCsvMutation } from './artistApi'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UploadCsv = () => {
  const { user } = useSelector(state => state.userSlice);
  const [uploadCsv, { isLoading }] = useUploadCsvMutation();

  const handleChange = async (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    try {
      await uploadCsv({
        token: user?.token,
        body: formData
      }).unwrap();
      toast.success('Upload Successfully');
    } catch (err) {
      toast.dismiss();
      toast.error(err.data?.message);
    }
  }
  return (

    <div className='w-[220px]'>
      <Input
        onChange={(e) => handleChange(e.target.files[0])}
        disabled={isLoading}
        name='csv'
        accept=".csv"
        type='file' label='upload cv' className="flex items-center gap-3 " placeholder='' variant='outlined' color='black' />
    </div>


  )
}

export default UploadCsv
