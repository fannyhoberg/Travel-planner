import {
  Box,
  Button,
  Container,
  Grid2,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import AddNewTrip from "../components/AddNewTrip";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [addNewTripDialog, setAddNewTripDialog] = useState(false);

  const addNewTrip = () => {
    setAddNewTripDialog(true);
  };

  const closeDialog = () => {
    setAddNewTripDialog(false);
  };

  return (
    <>
      <Stack flex={"flex"} flexDirection={"row"}>
        <Typography variant="h3">My trips</Typography>
        {!isMobile && (
          <Button onClick={addNewTrip} className="btn-primary">
            New trip +
          </Button>
        )}
      </Stack>

      <Container maxWidth="md">
        {isMobile ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={2} columns={8}>
              {Array.from({ length: 7 }).map((_, index) => (
                <Grid2 size={8} key={index}>
                  <Link
                    className="card-primary"
                    to={"/"}
                    style={{ textDecoration: "none" }}
                  >
                    {" "}
                    <Box
                      sx={{
                        backgroundColor: "#ede3d6",
                        height: 150,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        borderRadius: 3,
                      }}
                    >
                      <Typography variant="h4" color="#2a3132">
                        Paris 2025
                      </Typography>
                    </Box>
                  </Link>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid2 container spacing={6} columns={16}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid2 size={8} key={index}>
                  <Link
                    className="card-primary"
                    to={"/"}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#ede3d6",
                        height: 150,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        borderRadius: 3,
                      }}
                    >
                      <Typography variant="h4" color="#2a3132">
                        Paris 2025
                      </Typography>
                    </Box>
                  </Link>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        )}
      </Container>

      {addNewTripDialog && (
        <AddNewTrip isMobile={isMobile} onClose={closeDialog} />
      )}
    </>
  );
};

export default Dashboard;
