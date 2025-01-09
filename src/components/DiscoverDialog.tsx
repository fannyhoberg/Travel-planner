import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Trip } from "../types/trip";

type DiscoverDialogProps = {
  setShowContent: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTrip: Trip;
  isMobile: boolean;
};

const DiscoverDialog = ({
  setShowContent,
  selectedTrip,
  isMobile,
}: DiscoverDialogProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = (copy: string) => {
    navigator.clipboard
      .writeText(copy)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch(() => {
        console.error("Failed to copy address.");
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <>
      <Dialog
        open={true}
        onClose={() => setShowContent(false)}
        fullScreen={isMobile}
        disableScrollLock
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            maxWidth: isMobile ? "100%" : "400px",
            minWidth: isMobile ? "100%" : "300px",
            maxHeight: isMobile ? "100%" : "400px",
            padding: 2,
            margin: isMobile ? 0 : "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: 2,
            paddingTop: 4,
          }}
        >
          {selectedTrip.title}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {selectedTrip.lists?.map((list) => (
              <List key={list._id}>
                <Typography variant="h3" color="#2a3132">
                  {list.name}
                </Typography>
                {list?.items?.map((item) => (
                  <Box key={item._id} sx={{ mt: 1, pl: 2 }}>
                    <ListItemText primary={item.title} color="#2a3132" />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItemText
                        secondary={item.address}
                        sx={{
                          marginRight: 2,
                        }}
                        color="#2a3132"
                      />
                      <Button
                        sx={{
                          padding: 0,
                          minWidth: "auto",
                        }}
                        title="Copy address"
                        aria-label="Copy address"
                        color="inherit"
                        onClick={() => handleCopy(item.address || "")}
                      >
                        <ContentCopyIcon color="inherit" fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                ))}
              </List>
            ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Button
            onClick={() => setShowContent(false)}
            color="secondary"
            className="btn-secondary"
            aria-label="Cancel"
            title="Cancel"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message="Copied!"
        sx={{ backgroundColor: "F5F5F5", borderBlockColor: "black" }}
      />
    </>
  );
};

export default DiscoverDialog;
