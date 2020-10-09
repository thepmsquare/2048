import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const DialogApp = ({ children, title, open, onClose }) => {
    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-win-dialog-title"
            >
                <DialogTitle id="alert-win-dialog-title">{title}</DialogTitle>
                <DialogActions>
                    {children}
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogApp;
