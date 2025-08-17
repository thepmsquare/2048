import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import type { ReactNode } from "react";

// todo: move to a more appropriate place
interface DialogAppProps {
  children: ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
}

const DialogApp = ({ children, title, open, onClose }: DialogAppProps) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-win-dialog-title"
      >
        <DialogTitle id="alert-win-dialog-title">{title}</DialogTitle>
        <DialogActions>{children}</DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogApp;
