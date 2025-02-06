import React from 'react'
import { useParams } from 'react-router'
import { useGetUserByIdQuery } from '../auth/userApi';
import { Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import UpdateForm from './UpdateForm';

const ProfileUpdate = () => {
  const { user } = useSelector(state => state.userSlice);
  const { id } = useParams();

  const { data, error, isLoading } = useGetUserByIdQuery({
    token: user.token,
    id
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>Something went wrong</Typography>
  }



  return (
    <div>

      {data && <UpdateForm user={data} token={user.token} />}

    </div>
  )
}

export default ProfileUpdate
