import "./stylesheets/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
document.addEventListener(
  "touchstart",
  (event) => {
    const target = event.target as HTMLElement;
    // Check if the target is a button or other interactive element
    if (
      target.tagName.toLowerCase() === "button" ||
      target.tagName.toLowerCase() === "a" ||
      target.closest("button, a")
    ) {
      // Don't prevent default if it's a button or link
      return;
    }

    // Otherwise, prevent Safari's default back/forward swipe behavior
    event.preventDefault();
  },
  { passive: false }
);
