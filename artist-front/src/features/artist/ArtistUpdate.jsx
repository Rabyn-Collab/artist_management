import React from 'react'
import { useParams } from 'react-router'
import { Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { useGetArtistByIdQuery } from './artistApi';
import ArtistUpdateForm from './ArtistUpdateForm';

const ArtistUpdate = () => {
  const { user } = useSelector(state => state.userSlice);
  const { id } = useParams();

  const { data, error, isLoading } = useGetArtistByIdQuery(id);

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>Something went wrong</Typography>
  }



  return (
    <div>

      {data && <ArtistUpdateForm user={data[0] ?? {}} token={user.token} />}

    </div>
  )
}

export default ArtistUpdate
