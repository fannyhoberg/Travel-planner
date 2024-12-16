import React, { useEffect, useState } from "react";
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
import { Item } from "../types/trip";

type Props = {
  onClose: () => void;
  listName: string | null;
  onSubmit: (item: { title: string; address: string }) => void;
  initialValues?: Partial<Item>;
};

const ItemFormDialog = ({
  onSubmit,
  onClose,
  listName,
  initialValues,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //   const [item, setItem] = useState({
  //     id: "",
  //     title: "",
  //     address: "",
  //     city: "",
  //   })
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, address });
  };

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setAddress(initialValues.address || "");
      // setCity(initialValues.city || "");
    }
  }, [initialValues]);

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>
          {initialValues ? `Update place` : `Add place to ${listName}`}
        </DialogTitle>
        <DialogContent>
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
              helperText="example: Potsdamer Str. 3, 10785 Berlin, Tyskland"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
              }}
            />
            {/* <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="standard"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
              }}
            /> */}
            <Button
              variant="text"
              type="submit"
              className="btn-primary"
              sx={{ mt: 4 }}
            >
              {initialValues ? "Update" : "Add to list"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemFormDialog;
