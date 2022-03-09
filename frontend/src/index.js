import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Route } from "@simple-contacts/react-router-async-routes";

import Home from "./views/Home"

var hist = createBrowserHistory();
ReactDOM.render(
  <BrowserRouter history={hist}>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
)