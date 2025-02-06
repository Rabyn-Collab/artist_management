import React from 'react'
import { useGetArtistByIdQuery } from './artistApi'
import { Typography } from '@material-tailwind/react';
import clock from '../../assets/clock.png';
import SongsList from '../song/SongsList';

const ArtistPage = ({ user }) => {
  const { data, isLoading, error } = useGetArtistByIdQuery(user?.id);
  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }

  if (data?.length === 0) {
    return <div className='flex items-center flex-col mt-[10%] space-y-4'>
      <div >
        <img src={clock} className='h-[100px] w-[100px]' alt="" />
      </div>
      <div>

        <Typography className=" text-green-900">Wait until the artist_manager makes you an artist. </Typography>
      </div>

    </div>
  }


  return (
    <div>
      <SongsList user={data[0]} />
    </div>
  )
}

export default ArtistPage
