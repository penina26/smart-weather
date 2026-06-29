import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


import App from "./App";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { PlanningNotesProvider } from "./contexts/PlanningNotesContext";
import { RecentViewsProvider } from "./contexts/RecentViewsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     
        <AuthProvider>
          <WeatherProvider>
            <BookmarksProvider>
              <PlanningNotesProvider>
                <RecentViewsProvider>
                  <App />
                </RecentViewsProvider>
              </PlanningNotesProvider>
            </BookmarksProvider>
          </WeatherProvider>
        </AuthProvider>      
    
  </React.StrictMode>
);