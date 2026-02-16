import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/Index";
import { ThemeProvider } from "./providers/ThemeProvider";
import App from "./app/App";

// MSW فقط در dev اجرا می‌شود
if (import.meta.env.DEV) {
  import("./mocks/handlers/browser").then(({ worker }) => {
    worker.start();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
