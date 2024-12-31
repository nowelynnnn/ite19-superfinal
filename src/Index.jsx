import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routings from "./Routings.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routings />
  </StrictMode>
);
