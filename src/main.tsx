import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store/Index";
import { hydrateAuth } from "./app/store/slices/authSlice";
import { ThemeProvider } from "./providers/ThemeProvider";
import App from "./app/App";

store.dispatch(hydrateAuth());

const root = ReactDOM.createRoot(document.getElementById("root")!);

async function startApp() {
  // MSW only runs in dev mode.
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/handlers/browser");
    await worker.start();
    (window as Window & { __mswReady?: boolean }).__mswReady = true;
  }

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ReduxProvider>
    </React.StrictMode>,
  );
}

void startApp();
