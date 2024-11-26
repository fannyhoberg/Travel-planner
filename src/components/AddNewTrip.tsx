import { Box, Button, TextField, Typography } from "@mui/material";

type Props = {
  isMobile: boolean;
  onClose: () => void;
};

const AddNewTrip = ({ isMobile, onClose }: Props) => {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: isMobile ? 0 : "50%",
          left: isMobile ? 0 : "50%",
          width: isMobile ? "100%" : "30%",
          height: isMobile ? "100%" : "40%",
          backgroundColor: "#F5F5F5",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-start",
          padding: isMobile ? "20px" : "40px",
          ...(isMobile
            ? {}
            : {
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
                boxShadow: 2,
              }),
        }}
      >
        {/* Close button */}
        <Button
          variant="text"
          sx={{
            position: "absolute",
            top: isMobile ? 20 : 10,
            right: isMobile ? 20 : 10,
            padding: 0,
            color: "black",
          }}
          onClick={onClose}
        >
          X
        </Button>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Where we going?
        </Typography>

        <Box sx={{ mt: 4, p: isMobile ? 2 : 5 }} component="form">
          <TextField
            label="Name your trip"
            name="name"
            type="name"
            variant="standard"
            required
            fullWidth
          />

          <Button
            variant="text"
            type="submit"
            className="btn-primary"
            sx={{ mt: 4 }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Blurred background */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(0.5px)",
            zIndex: 1200,
          }}
        />
      )}
    </>
  );
};

export default AddNewTrip;
