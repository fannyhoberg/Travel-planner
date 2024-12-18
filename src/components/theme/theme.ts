import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Karla, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "3rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 400,
      fontSize: "1.1rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },

    body1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.9rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: "uppercase",
      fontSize: "0.875rem",
    },
  },
  palette: {
    background: {
      default: "#f5f3ed",
    },
    text: {
      primary: "#2a3132",
    },
  },
});

export default theme;
