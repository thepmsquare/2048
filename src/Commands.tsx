import "./stylesheets/Commands.css";

import { Component } from "react";

import CachedIcon from "@mui/icons-material/Cached";
import Replay from "@mui/icons-material/Replay";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

// todo: move to a more appropriate place
interface CommandsProps {
  numberOfUndos: number;
  handleUndo: () => void;
  handleReset: () => void;
}

// todo: move to a more appropriate place
interface CommandsState {
  showDialog: boolean;
}

class Commands extends Component<CommandsProps, CommandsState> {
  constructor(props: CommandsProps) {
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
