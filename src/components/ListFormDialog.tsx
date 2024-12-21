import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { List, ListTextData } from "../types/trip";

type TripListProps = {
  onClose: () => void;
  handleSubmitNewList?: (data: ListTextData) => void;
  handleEditList?: (data: ListTextData) => void;
  setListName: (value: string) => void;
  setSelectedColor: (value: string) => void;
  selectedColor: string;
  initialValues?: Partial<List>;
};

const ListFormDialog = ({
  onClose,
  handleSubmitNewList,
  handleEditList,
  setListName,
  setSelectedColor,
  initialValues,
}: TripListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = [
    "#F48FB1",
    "#66BB6A",
    "#3A8DFF",
    "#FFCA28",
    "#80DEEA",
    "#FF6F61",
    "#D672EA",
  ];
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFB2AA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setListName(name);
    setSelectedColor(color);

    const data: ListTextData = { name, color };

    console.log("Submitting data:", data);

    if (initialValues) {
      handleEditList && handleEditList(data);
    } else {
      console.log("handleSubmitNewList");

      handleSubmitNewList && handleSubmitNewList(data);
    }
    onClose();
  };

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setColor(initialValues.color || "#FFB2AA");
    }
  }, [initialValues]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={isMobile}
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxWidth: isMobile ? "100%" : "400px",
          minWidth: isMobile ? "100%" : "300px",
          maxHeight: isMobile ? "100%" : "500px",
          padding: 2,
          margin: isMobile ? 0 : "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          textAlign: "center",
          paddingTop: 4,
        }}
      >
        {initialValues ? "Update List" : "Add New List"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          <TextField
            label="List Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="standard"
            required
            sx={{
              maxWidth: isMobile ? "450px" : "600px",
              width: "100%",
              mb: 3,
            }}
          />
          <Box sx={{ mb: 4, display: "flex", gap: "10px" }}>
            {colors.map((c) => (
              <Box
                key={c}
                sx={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: c,
                  borderRadius: "50%",
                  border: color === c ? "2px solid black" : "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setColor(c), setSelectedColor(color);
                }}
              />
            ))}
          </Box>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Button
              onClick={onClose}
              color="secondary"
              variant="outlined"
              className="btn-secondary"
              aria-label="Cancel"
              title="Cancel"
              sx={{
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              type="submit"
              className="btn-primary"
              aria-label={initialValues ? "Save" : "Add"}
              title={initialValues ? "Save" : "Add"}
              // disabled={isLoading ? true : false}

              sx={{
                borderRadius: 2,
              }}
            >
              {initialValues ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ListFormDialog;
