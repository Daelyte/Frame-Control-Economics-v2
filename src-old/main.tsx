import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./utils/analytics";
import { initDeviceDetection } from "./utils/deviceDetection";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

// Initialize analytics and device detection
initAnalytics();
initDeviceDetection();

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
