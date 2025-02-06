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

const RemoveDialog = ({ removeFunc, isLoading, isSong, id }) => {


  const { user } = useSelector(state => state.userSlice);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const handelRemoveFunc = async () => {
    try {
      await removeFunc({
        id,
        token: user?.token
      }).umwrap();
      toast.success('Removed Successfully');
      handleOpen();
    } catch (err) {
      toast.dismiss();
      toast.error(err.data?.message);
      handleOpen();

    }
  }

  return (
    <>
      {isSong ? <IconButton onClick={handleOpen} size='sm' color='pink'>
        <i className="fas fa-trash" />
      </IconButton> : <IconButton
        onClick={handleOpen}
        variant="text" color="pink">
        <TrashIcon className="h-4 w-4" />
      </IconButton>}

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Are you sure ?</DialogHeader>
        <DialogBody>
          You Want To Remove This User
        </DialogBody>
        <DialogFooter>
          <Button
            disabled={isLoading}
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button loading={isLoading} variant="gradient" color="green" onClick={handelRemoveFunc}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}


export default RemoveDialog