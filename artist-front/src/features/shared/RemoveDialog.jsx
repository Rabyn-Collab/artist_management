import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRemoveArtistMutation } from "../artist/artistApi";
import { useRemoveUserMutation } from "../auth/userApi";
import { useRemoveSongMutation } from "../song/songApi";

const RemoveDialog = ({ isUser, id, isArtist }) => {

  const [removeArtist, { isLoading: load }] = useRemoveArtistMutation();
  const [removeSong, { isLoading: songLoad }] = useRemoveSongMutation();
  const [removeUser, { isLoading }] = useRemoveUserMutation();
  const { user } = useSelector(state => state.userSlice);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);


  const handelRemoveFunc = async () => {
    try {
      if (isArtist) {
        await removeSong({
          token: user?.token,
          id
        }).unwrap();
      } else if (isUser) {
        await removeUser({
          token: user?.token,
          id
        }).unwrap();

      } else {
        await removeArtist({
          token: user?.token,
          id
        }).unwrap();
      }

      toast.success('Removed Successfully');
      handleOpen();
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error(err.data?.message || err.message);
      handleOpen();

    }
  }

  return (
    <>
      {!isUser ? <IconButton onClick={handleOpen} size='sm' color='pink'>
        <i className="fas fa-trash" />
      </IconButton> : <IconButton
        onClick={handleOpen}
        variant="text" color="pink">
        <TrashIcon className="h-4 w-4" />
      </IconButton>}

      <Dialog open={open} handler={handleOpen} className="w-full" size="lg">
        <DialogHeader>Are you sure ?</DialogHeader>
        <DialogBody>
          You Want To Remove This User
        </DialogBody>
        <DialogFooter>
          <Button
            disabled={isLoading || load || songLoad}
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            loading={isLoading || load || songLoad}
            variant="gradient" color="green" onClick={handelRemoveFunc}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}


export default RemoveDialog