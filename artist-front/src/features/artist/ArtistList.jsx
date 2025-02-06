import React from 'react'
import { useGetAllArtistsQuery } from './artistApi';
import { useSelector } from 'react-redux';
import { Typography } from '@material-tailwind/react';
import { ArtistTable } from '../shared/ArtistTable';

const ArtistList = () => {
  const { user } = useSelector(state => state.userSlice);
  const { data, error, isLoading } = useGetAllArtistsQuery(user.token);


  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }



  return (
    <div>

      {data && <ArtistTable data={data} isUser={user.role !== 'super_admin'} user={user} />}

    </div>
  )
}

export default ArtistList
