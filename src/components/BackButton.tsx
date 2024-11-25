import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface BackButtonProps {
  to?: string;
}

const BackButton = ({ to = "/" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button
      onClick={handleClick}
      sx={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        color: "#2A3132",
        textTransform: "none",
      }}
      aria-label="back button"
    >
      <ArrowBackIosNewIcon />
    </Button>
  );
};

export default BackButton;
