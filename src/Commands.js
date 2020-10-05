import React, { Component } from "react";
import Replay from "@material-ui/icons/Replay";
import CachedIcon from "@material-ui/icons/Cached";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./stylesheets/Commands.css";

class Commands extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
    };
  }
  openDialog = () => {
    this.setState(() => {
      return { showDialog: true };
    });
  };
  handleCloseDialog = () => {
    this.setState(() => {
      return { showDialog: false };
    });
  };
  handleConfirm = () => {
    this.props.handleReset();
    this.handleCloseDialog();
  };
  render = () => {
    return (
      <div className="Commands">
        <Badge badgeContent={this.props.numberOfUndos} color="primary">
          <IconButton onClick={this.props.handleUndo}>
            <Replay />
          </IconButton>
        </Badge>

        <IconButton onClick={this.openDialog}>
          <CachedIcon />
        </IconButton>

        <Dialog
          open={this.state.showDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Reset?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Current Progess will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleConfirm} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

export default Commands;
