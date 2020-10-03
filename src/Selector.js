import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import "./stylesheets/Selector.css";

class Selector extends Component {
  constructor(props) {
    super(props);
    // for slider
    this.marks = [
      {
        value: 3,
        label: "3",
      },
      {
        value: 4,
        label: "4",
      },
      {
        value: 5,
        label: "5",
      },
      {
        value: 6,
        label: "6",
      },
      {
        value: 7,
        label: "7",
      },
      {
        value: 8,
        label: "8",
      },
    ];
    this.state = {
      displayRow: false,
    };
  }
  // for ARIA
  valuetext = (value) => {
    return `{value}`;
  };
  toggleDisplayRow = () => {
    this.setState((curState) => {
      if (curState.displayRow === true) {
        return { displayRow: false };
      } else {
        return { displayRow: true };
      }
    });
  };
  render = () => {
    return (
      <div className="Selector">
        <Button onClick={this.toggleDisplayRow}>Change Grid Size</Button>
        {this.state.displayRow && (
          <div className="Selector-secondRow">
            <Slider
              defaultValue={4}
              getAriaValueText={this.valuetext}
              aria-labelledby="grid-size-adjust-slider"
              valueLabelDisplay="off"
              step={1}
              min={3}
              max={8}
              marks={this.marks}
            />
            <Button>Confirm</Button>
          </div>
        )}
      </div>
    );
  };
}

export default Selector;
