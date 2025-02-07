import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
import { useImportCsvMutation, useRemoveArtistMutation } from "../artist/artistApi";
import RemoveDialog from "./RemoveDialog";
import UploadCsv from "../artist/UploadCsv";
import { toast } from "react-toastify";


const TABLE_HEAD1 = ["Name", "Gender", "First Release Year", "No. of Albums", "Edit", "Remove", "List of Songs"];

const TABLE_HEAD2 = ["Name", "Gender", "First Release Year", "No. of Albums", "List of Songs"];





export function ArtistTable({ data, isUser, user }) {
  const TABLE_HEAD = user.role === 'super_admin' ? TABLE_HEAD2 : TABLE_HEAD1;
  const nav = useNavigate();
  const [importCsv, { isLoading }] = useImportCsvMutation();
  const handleImport = async () => {
    try {

      const res = await importCsv(user.token).unwrap();
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'artists_export.csv';
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Import Successfully');
    } catch (err) {

      toast.dismiss();
      toast.error(err.data?.message || err.message || 'no-artists record found');
    }
  };


  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-2 flex items-center md:flex-col justify-between md:items-start  gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {isUser && user?.role !== 'artist_manager' ? 'Users List' : 'Artists'}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all {isUser ? 'users' : 'artists'}
            </Typography>
          </div>
          {isUser && <div className="flex shrink-0  gap-2 sm:flex-row">
            <Button onClick={() => nav(isUser && user?.role !== 'artist_manager' ? '/register' : '/artist-form')} className="flex items-center gap-3" size="sm">
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> {isUser && user?.role !== 'artist_manager' ? 'Add user' : 'Add artist'}
            </Button>
            <Button onClick={handleImport} loading={isLoading} size="sm">Csv Import</Button>
            {/* <UploadCsv /> */}


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
              ({ name, gender, first_release_year, no_of_albums_released, id, user_id }, index) => {

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
                            {name}
                          </Typography>

                        </div>
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
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {first_release_year}
                        </Typography>

                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no_of_albums_released}
                      </Typography>
                    </td>
                    {user.role === 'artist_manager' && <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton
                          onClick={() => nav(`artist-update/${id}`)}
                          variant="text" color="green">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>}
                    {user.role === 'artist_manager' && <td className={classes}>
                      <Tooltip content="Remove User">
                        <RemoveDialog isUser={false} id={id} />
                      </Tooltip>
                    </td>}
                    <td className={classes}>
                      <Tooltip content="View Songs">
                        <Button
                          onClick={() => nav(`/artist-songs/${id}`)}
                          variant="text"
                          size="sm"
                          className="text-blue-gray-700">
                          View Songs
                        </Button>
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

