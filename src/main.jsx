import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { startKeepAlive } from "./utils/keepAlive.js";

console.log("✅ Build curat — " + import.meta.env.VITE_API_URL);

startKeepAlive();

// The client renders the same page and identity schemas through Helmet.
// Remove the build-time graph so it cannot survive navigation to another route.
document.querySelectorAll("script[data-static-seo]").forEach((node) => node.remove());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
