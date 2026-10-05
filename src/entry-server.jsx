import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import Docs from "./Docs.jsx";
export function render(path) {
  return renderToString(path === "/docs/" ? <Docs /> : <App />);
}
