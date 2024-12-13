import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        position: "fixed",
        top: "5rem",
        left: "2rem",
        color: "#2A3132",
        textTransform: "none",
        zIndex: 10000,
      }}
      aria-label="Go back to previous page"
      title="Go back to previous page"
    >
      <ArrowBackIcon fontSize="large" />
      <span style={{ marginLeft: "0.5rem" }}>Back</span>
    </Button>
  );
};

export default BackButton;
