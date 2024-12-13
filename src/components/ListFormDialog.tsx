import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
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
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFB2AA");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setListName(name);
    setSelectedColor(color);

    const data: ListTextData = { name, color };

    if (initialValues) {
      handleEditList && handleEditList(data);
    } else {
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
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
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
          <Button
            variant="text"
            type="submit"
            className="btn-primary"
            sx={{ mt: 4 }}
          >
            {initialValues ? "Update" : "Add"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListFormDialog;
