import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import Docs from "./Docs.jsx";
import DemoPage from "./DemoPage.jsx";

export function render(path) {
  const Page = path === "/docs/" ? Docs : path === "/demo/" ? DemoPage : App;
  return renderToString(<Page />);
}
