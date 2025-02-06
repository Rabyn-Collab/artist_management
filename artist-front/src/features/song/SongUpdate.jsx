import React from 'react'
import { useGetSongByIdQuery } from './songApi'
import { useParams } from 'react-router';
import { Typography } from '@material-tailwind/react';
import SongEditForm from './SongEditForm';

const SongUpdate = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetSongByIdQuery(id);

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }



  return (
    <div>

      {data && <SongEditForm song={data} />}

    </div>
  )
}

export default SongUpdate
