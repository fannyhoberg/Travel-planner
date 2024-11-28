import {
  Box,
  Button,
  ClickAwayListener,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

type Props = {
  onClose: () => void;
  listName: string | null;
};

const AddItemToList = ({ onClose, listName }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log("listName", listName);

  return (
    <>
      {/* <ClickAwayListener onClickAway={() => setAddNewTripDialog(false)}> */}
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
          {listName}
        </Typography>

        <Box
          sx={{ mt: 4, p: isMobile ? 2 : 5 }}
          component="form"
          //   onSubmit={handleSubmit}
        >
          <TextField
            label="Name of place"
            name="title"
            type="text"
            variant="standard"
            required
            fullWidth
            // value={formData.title}
            // onChange={handleChange}
          />
          <TextField
            label="Adress"
            name="adress"
            type="text"
            variant="standard"
            required
            fullWidth
            // value={formData.title}
            // onChange={handleChange}
          />
          <TextField
            label="Post code"
            name="adress"
            type="text"
            variant="standard"
            required
            fullWidth
            // value={formData.title}
            // onChange={handleChange}
          />

          <Button
            variant="text"
            type="submit"
            className="btn-primary"
            sx={{ mt: 4 }}
          >
            Add to list
          </Button>
        </Box>
      </Box>
      {/* {error && <div>{error}</div>}
      {loading && <div>{loading}</div>} */}
      {/* Blurred bacground */}
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
      {/* </ClickAwayListener> */}
    </>
  );
};

export default AddItemToList;
