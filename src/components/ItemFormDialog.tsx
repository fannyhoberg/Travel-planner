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
import { Autocomplete } from "@react-google-maps/api";

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

  const [title, setTitle] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, address });
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setAddress(place.formatted_address);
    } else {
      console.log("No address available for this place.");
    }
  };
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setAddress(initialValues.address || "");
    }
  }, [initialValues]);

  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
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
                pb: 2,
              }}
            />

            <Autocomplete
              onLoad={(autocomplete) => {
                console.log("Autocomplete loaded:", autocomplete);
                if (autocomplete) {
                  autocomplete.addListener("place_changed", () => {
                    try {
                      const place = autocomplete.getPlace();
                      handlePlaceSelected(place);
                      if (place.formatted_address) {
                        setAddress(place.formatted_address);
                      } else {
                        console.log("No formatted address available.");
                      }
                    } catch (error) {
                      console.error("Error handling place_changed:", error);
                    }
                  });
                }
              }}
              options={{
                types: ["address"],
              }}
            >
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                aria-label="Enter address"
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "16px",
                  border: "none",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                  outline: "none",
                  padding: "8px 0",
                }}
              />
            </Autocomplete>
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
