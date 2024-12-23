import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
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
  return (
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
                  <ListItemText primary={item.title} />
                  <ListItemText secondary={item.address} />
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
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscoverDialog;
