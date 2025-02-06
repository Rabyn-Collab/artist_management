import { Option, Select } from '@material-tailwind/react'
import React from 'react'

const ArtistSelect = ({ setFieldValue, errors, touched, users }) => {
  return (
    <div>
      <Select
        name="user"
        onChange={(e) => setFieldValue("user", e)}
        label="Select Users">
        {users.map((user) => {
          return <Option
            key={user.id} value={user}>{`${user.first_name} ${user.last_name}`}</Option>;
        })}



      </Select>

      {errors.user && touched.user && <h1 className="text-red-700 text-sm">user is a required field</h1>}
    </div>
  )
}

export default ArtistSelect
