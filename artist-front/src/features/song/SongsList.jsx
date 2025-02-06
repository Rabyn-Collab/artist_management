import React from 'react'
import { useGetArtistsSongsQuery, useRemoveSongMutation } from './songApi'
import { Button, Card, IconButton, List, ListItem, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router';
import RemoveDialog from '../shared/RemoveDialog';

const SongsList = ({ user }) => {
  const nav = useNavigate();
  const [removeSong, { isLoading: load }] = useRemoveSongMutation();
  const { data, isLoading, error } = useGetArtistsSongsQuery(user?.id);

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>{error.message}</Typography>
  }




  return (
    <div>
      <div className='flex justify-end'>
        <Button onClick={() => nav(`/song-form/${user?.id}`)} size='sm'>Add Song</Button>
      </div>

      {
        data?.length === 0 && <div className='flex items-center flex-col mt-[10%] '>

          <div>
            <Typography className=" text-green-900">Add a Song To Show !</Typography>
          </div>

        </div>

      }

      <Card className='max-w-[500px]'>
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

              <div className=' space-x-5'>
                <IconButton
                  onClick={() => nav(`/song-update/${song.id}`)}
                  size='sm' color='green'>
                  <i className="fas fa-edit" />
                </IconButton>
                <RemoveDialog removeFunc={removeSong} isLoading={load} isSong={true} id={song.id} />
              </div>
            </ListItem>
          ))}



        </List>
      </Card>



    </div>
  )
}

export default SongsList


