import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/app.css";
import App from "./App";
import Docs from "./Docs.jsx";
import DemoPage from "./DemoPage.jsx";

const path = window.location.pathname.replace(/\/$/, "");
const isDocsHost = window.location.hostname.startsWith("docs.");
const Page = isDocsHost || path === "/docs" ? Docs : path === "/demo" ? DemoPage : App;
const root = document.getElementById("root");
const page = (
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, page);
else ReactDOM.createRoot(root).render(page);
