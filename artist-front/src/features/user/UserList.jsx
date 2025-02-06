import React from 'react'
import { useGetAllUsersQuery } from '../auth/userApi'
import { Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { MembersTable } from '../shared/MembersTable';

const UserList = () => {
  const { user } = useSelector(state => state.userSlice);

  const { isLoading, isError, data, error } = useGetAllUsersQuery(user.token);
  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>{error.message}</Typography>
  }

  return (
    <div>
      {data && <MembersTable data={data} isUser={true} />}

    </div>
  )
}

export default UserList
