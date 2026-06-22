import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { WeatherProvider } from "./contexts/WeatherContext";
import { BookmarksProvider } from "./contexts/BookmarksContext"; // ✅ ADD THIS
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WeatherProvider>
        <BookmarksProvider>
          <App />
        </BookmarksProvider>
      </WeatherProvider>
    </BrowserRouter>
  </React.StrictMode>
);
