import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Trip } from "../types/trip";

type MoveItemDialogProps = {
  moveItemDialogOpen: boolean;
  setMoveItemDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trip: Trip | null;
  handleMoveItem: (value: string) => Promise<void>;
  currentListName: string;
};

const MoveItemDialog = ({
  moveItemDialogOpen,
  setMoveItemDialogOpen,
  trip,
  handleMoveItem,
  currentListName,
}: MoveItemDialogProps) => {
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleListSelection = (listName: string) => {
    setSelectedList(listName);
  };

  const handleMoveItemSubmit = async () => {
    if (selectedList) {
      await handleMoveItem(selectedList);
      setMoveItemDialogOpen(false);
      setSelectedList(null);
    }
  };

  return (
    <Dialog
      open={moveItemDialogOpen}
      onClose={() => setMoveItemDialogOpen(false)}
      disableScrollLock
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxWidth: isMobile ? "100%" : "400px",
          minWidth: isMobile ? "100%" : "300px",
          maxHeight: isMobile ? "100%" : "500px",
          padding: 2,
          margin: isMobile ? 0 : "auto",
          zIndex: 2000,
        },
      }}
    >
      <DialogTitle variant="h4">Move place</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Select a list to move place to:</Typography>
        {trip?.lists?.map((list) => (
          <Button
            key={list._id}
            onClick={() => handleListSelection(list.name)}
            disabled={list.name === currentListName}
            sx={{
              margin: 1,
              backgroundColor:
                selectedList === list.name ? "#f1cd97" : "transparent",
              border: "0.1px solid #f9a628",
              color: "black",
            }}
            aria-label={list.name}
            title={list.name}
            variant={selectedList === list.name ? "contained" : "outlined"}
          >
            {list.name}
          </Button>
        ))}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: 2,
            mt: 2,
          }}
        >
          <Button
            onClick={() => {
              setMoveItemDialogOpen(false);
              setSelectedList(null);
            }}
            variant="outlined"
            aria-label="Cancel"
            title="Cancel"
            className="btn-secondary"
            sx={{
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMoveItemSubmit}
            disabled={!selectedList}
            className="btn-primary"
            aria-label="Move"
            title="Move"
            sx={{
              borderRadius: 2,
            }}
          >
            Move
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default MoveItemDialog;
