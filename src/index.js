import React from "react";
import ReactDOM from "react-dom";
import "./stylesheets/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
document.addEventListener(
  "touchstart",
  function (event) {
    // Check if the target is a button or other interactive element
    if (
      event.target.tagName.toLowerCase() === "button" ||
      event.target.tagName.toLowerCase() === "a" ||
      event.target.closest("button, a")
    ) {
      // Don't prevent default if it's a button or link
      return;
    }

    // Otherwise, prevent Safari's default back/forward swipe behavior
    event.preventDefault();
  },
  { passive: false }
);
