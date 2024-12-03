import React, { useState } from "react";
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
  onSubmit: (item: { title: string; address: string; city: string }) => void;
};

const AddItemToList = ({ onSubmit, onClose, listName }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, address, city });
  };

  return (
    <>
      <ClickAwayListener onClickAway={onClose}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
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
            padding: isMobile ? "0px" : "40px",
            ...(isMobile
              ? {}
              : {
                  transform: "translate(-50%, -50%)",
                  borderRadius: "10px",
                  boxShadow: 2,
                }),
          }}
        >
          <Button
            variant="text"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "black",
            }}
            onClick={onClose}
          >
            X
          </Button>

          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Add place to {listName}
          </Typography>

          <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name of place"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
              }}
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="standard"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
              }}
            />
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="standard"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
              }}
            />
            <Button
              variant="text"
              type="submit"
              className="btn-primary"
              sx={{ mt: 4 }}
            >
              {" "}
              Add to list
            </Button>
          </Box>
        </Box>
      </ClickAwayListener>
    </>
  );
};

export default AddItemToList;
