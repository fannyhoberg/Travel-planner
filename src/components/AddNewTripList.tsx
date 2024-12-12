import { Box, Button, ClickAwayListener, TextField } from "@mui/material";
import React from "react";

type TripListProps = {
  setAddNewTripDialog: (value: boolean) => void;
  handleSubmitNewList: (e: React.FormEvent) => void;
  setListName: (value: string) => void;
  setSelectedColor: (value: string) => void;
  selectedColor: string;
};

const AddNewTripList = ({
  setAddNewTripDialog,
  handleSubmitNewList,
  setListName,
  selectedColor,
  setSelectedColor,
}: TripListProps) => {
  const colors = [
    "#FFB2AA",
    "#FFA07A",
    "#FF6347",
    "#FFD700",
    "#ADFF2F",
    "#32CD32",
    "#1E90FF",
    "#9370DB",
    "#FF69B4",
    "#FF4500",
  ];
  return (
    <ClickAwayListener onClickAway={() => setAddNewTripDialog(false)}>
      <Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mb: 2,
          }}
          component="form"
          onSubmit={handleSubmitNewList}
        >
          <TextField
            label="Name your list"
            name="new-list"
            type="text"
            variant="standard"
            // value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
            sx={{ flex: 1 }}
          />
          <Button
            sx={{ marginLeft: 0, color: "black" }}
            variant="text"
            type="submit"
            aria-label="Enter OK"
            title="OK add to list"
          >
            OK
          </Button>
        </Box>
        <Box sx={{ mb: 4 }}>
          {/* <Typography sx={{ alignItems: "left" }}>
                    Select a Color
                  </Typography> */}
          <Box style={{ display: "flex", gap: "10px" }}>
            {colors.map((color) => (
              <Box
                key={color}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: color,
                  borderRadius: "50%",
                  border: selectedColor === color ? "2px solid black" : "none",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default AddNewTripList;
