import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// StrictMode disabled: react-leaflet can double-mount the map in dev and
// trigger "Too many re-renders" with useMap effects.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
