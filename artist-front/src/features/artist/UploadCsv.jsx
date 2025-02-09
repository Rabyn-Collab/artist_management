import { Button } from '@material-tailwind/react'
import React, { useRef } from 'react'
import { useUploadCsvMutation } from './artistApi'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const UploadCsv = () => {
  const { user } = useSelector(state => state.userSlice);
  const [uploadCsv, { isLoading }] = useUploadCsvMutation();
  const ref = useRef();

  const handleChange = async (e) => {
    const fileUploaded = e.target.files[0];
    const formData = new FormData();
    formData.append('csv', fileUploaded);
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
    e.target.value = null;
  }

  const handleClick = event => {
    ref.current.click();
  };
  return (

    <div >

      <Button
        onClick={handleClick}
        loading={isLoading} size="sm">Csv Import</Button>
      <input
        ref={ref}
        onChange={handleChange}
        name='csv'
        accept=".csv"
        type='file' className="hidden" placeholder='' />
    </div>


  )
}

export default UploadCsv
