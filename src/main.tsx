import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./assets/scss/App.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./contexts/AuthContextProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./components/theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
