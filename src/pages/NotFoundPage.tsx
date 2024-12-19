import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import NotFoundMobile from "../assets/images/404-not-found_mobile.png";
import NotFoundDesktop from "../assets/images/404-not-found_desktop.png";

const NotFoundPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        mt: 5,
        overflow: "hidden",
      }}
    >
      <Typography variant="h2" sx={{ mb: 4 }}>
        Looks like you're lost?
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={isMobile ? NotFoundMobile : NotFoundDesktop}
          alt="404 Not Found"
          style={{
            width: isMobile ? "100%" : "50%",
            height: isMobile ? "100%" : "50%",
            maxHeight: "100vh",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Box>
    </Box>
  );
};

export default NotFoundPage;
