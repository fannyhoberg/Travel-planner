import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <CircularProgress
      title="loading spinner"
      aria-label="loading spinner"
      size={40}
      color="success"
      sx={{ position: "fixed", top: "5rem", right: "4.5rem" }}
    />
  );
};

export default LoadingSpinner;
