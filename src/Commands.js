import React, { Component } from "react";
import Replay from "@material-ui/icons/Replay";
import CachedIcon from "@material-ui/icons/Cached";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import "./stylesheets/Commands.css";

class Commands extends Component {
  render = () => {
    return (
      <div className="Commands">
        <Badge badgeContent={5} color="primary">
          <IconButton>
            <Replay />
          </IconButton>
        </Badge>

        <IconButton>
          <CachedIcon />
        </IconButton>
      </div>
    );
  };
}

export default Commands;
