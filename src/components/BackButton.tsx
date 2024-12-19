import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type BackButtonProps = {
  to?: string;
};
const BackButton = ({ to }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        position: "absolute",
        top: "5rem",
        left: "0.9rem",
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
