import React from 'react'
import { useGetAllUsersQuery } from '../auth/userApi'
import { Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { MembersTable } from '../shared/MembersTable';
import { useState } from 'react';

const UserList = () => {
  const { user } = useSelector(state => state.userSlice);
  const [page, setPage] = useState(1);
  const { isLoading, isError, data, error } = useGetAllUsersQuery({
    token: user.token,
    page
  });
  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>{error.message}</Typography>
  }

  return (
    <div>
      {data && <MembersTable data={data} isUser={true} setPage={setPage} />}

    </div>
  )
}

export default UserList
