import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Calendar } from "./components/Calendar";
import "./index.css";

export default function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>Post Scheduler</h1>
          <p>Drag a post onto a new day to reschedule it. Click a post to edit it.</p>
        </header>
        <Calendar />
      </div>
    </Provider>
  );
}
