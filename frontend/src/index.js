import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { UserProvider } from "./context/UserContext";
import UserBasedProviders from "./UserBasedProviders";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <UserBasedProviders />
    </UserProvider>
  </React.StrictMode>
);
