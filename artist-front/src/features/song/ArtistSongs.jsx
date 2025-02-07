import React from 'react'
import { useGetArtistsSongsQuery } from './songApi'
import { Button, Card, List, ListItem, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router';


const ArtistSongs = () => {

  const { id } = useParams();

  const { data, isLoading, error } = useGetArtistsSongsQuery(id);

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }




  return (
    <div>
      <Typography variant='h5' className='mb-5'>Songs List</Typography>

      {
        data?.length === 0 && <div className='flex items-center flex-col mt-[10%] '>

          <div>
            <Typography className=" text-green-900">The artist has no songs !</Typography>
          </div>

        </div>

      }

      {data?.length > 0 && <Card className='max-w-[500px]'>
        <List>

          {data && data.map((song) => (
            <ListItem key={song.id} className='flex justify-between'>
              <div>
                <Typography variant="h6" color="blue-gray">
                  {song.title}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {`Album:- ${song.album_name}`}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {`Genre:- ${song.genre}`}
                </Typography>
              </div>

            </ListItem>
          ))}



        </List>
      </Card>}



    </div>
  )
}

export default ArtistSongs


