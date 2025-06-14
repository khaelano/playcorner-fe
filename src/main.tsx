import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Redirect, Route, Switch } from "wouter";

import "./index.css";
import { worker } from "./api/mock/browser";
import { HomePage } from "./pages/Home";
import { HistoriesPage } from "./pages/Histories";
import { ProfilePage } from "./pages/Profile";
import Navbar from "./components/Navbar";
import HistoryPage from "./pages/History";
import LoginPage from "./pages/Login";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Switch>
        <div className="mb-28">
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/history" nest>
            <Route path="/">
              <HistoriesPage />
            </Route>
            <Route path="/:histId">
              <HistoryPage />
            </Route>
          </Route>
          <Route path="/profile">
            <ProfilePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <Redirect to="/home" replace />
          </Route>
        </div>
      </Switch>
      {/* <Redirect to="/home" replace /> */}
      <Navbar />
    </StrictMode>,
  );
});
