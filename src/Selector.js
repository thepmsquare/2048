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
    const startSize = JSON.parse(window.localStorage.getItem("gridSize")) || 4;
    this.state = {
      displayRow: false,
      value: startSize,
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
  handleChange = (event, newValue) => {
    event.stopPropagation();
    this.setState(() => {
      return {
        value: newValue,
      };
    });
  };
  handleConfirm = () => {
    const newGrid = this.state.value;
    this.props.handleChangeGrid(newGrid);
    this.toggleDisplayRow();
  };
  render = () => {
    return (
      <div className="Selector">
        <Button onClick={this.toggleDisplayRow}>Change Grid Size</Button>
        {this.state.displayRow && (
          <div className="Selector-secondRow">
            <Slider
              value={this.state.value}
              getAriaValueText={this.valuetext}
              aria-labelledby="grid-size-adjust-slider"
              valueLabelDisplay="off"
              step={1}
              min={3}
              max={8}
              marks={this.marks}
              onChange={this.handleChange}
            />
            <Button onClick={this.handleConfirm}>Confirm</Button>
          </div>
        )}
      </div>
    );
  };
}

export default Selector;
