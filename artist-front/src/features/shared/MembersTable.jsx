import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useNavigate } from "react-router";
import RemoveDialog from "./RemoveDialog";
import { useRemoveUserMutation } from "../auth/userApi";


const TABLE_HEAD = ["Name", "Email", "Phone", "Gender", "Role", "Edit", "Remove"];

export function MembersTable({ data, isUser, user }) {


  const [removeUser, { isLoading }] = useRemoveUserMutation();
  const nav = useNavigate();
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {isUser && user?.role !== 'artist_manager' ? 'Users List' : 'Artists'}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all {isUser ? 'users' : 'artists'}
            </Typography>
          </div>
          {isUser && <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={() => nav(isUser && user?.role !== 'artist_manager' ? '/register' : '/artist-form')} className="flex items-center gap-3" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> {isUser && user?.role !== 'artist_manager' ? 'Add user' : 'Add artist'}
            </Button>
          </div>}
        </div>

      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className=" w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>

            {!data?.users.length && <tr><td colSpan={7} className="text-center pt-5 font-medium">No {isUser ? 'users' : 'artists'} found</td></tr>}


            {data?.users.map(
              ({ address, dob, email, first_name, gender, last_name, name, phone, role, id }, index) => {

                const classes = "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">

                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {first_name} {last_name}
                          </Typography>

                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>

                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {phone}
                        </Typography>

                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={gender === 'm' ? "Male" : "Female"}
                          color={gender === 'm' ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {role}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton
                          onClick={() => nav(`/profile-update/${id}`)}
                          variant="text" color="green">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Remove User">
                        <RemoveDialog removeFunc={removeUser} isLoading={isLoading} id={id} />
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {data?.page}  {`of ${data?.totalPages}`}
        </Typography>
        <div className="flex gap-2">
          <Button disabled={data?.page === 1} variant="outlined" size="sm">
            Previous
          </Button>
          <Button disabled={data?.page === data?.totalPages || data?.totalPages === 0} variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}