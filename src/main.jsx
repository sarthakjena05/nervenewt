import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Docs from "./Docs.jsx";
const Page =
  window.location.pathname.replace(/\/$/, "") === "/docs" ? Docs : App;
const root = document.getElementById("root");
const page = (
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, page);
else ReactDOM.createRoot(root).render(page);
