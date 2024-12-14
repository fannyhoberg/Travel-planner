import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import useAddTrip from "../hooks/useAddTrip";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import useAuth from "../hooks/useAuth";
import { TripTextData } from "../types/trip";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

type Props = {
  isMobile: boolean;
  closeDialog: () => void;
  initialValue?: string;
  id?: string | null;
};

const AddNewTrip = ({ isMobile, closeDialog, initialValue, id }: Props) => {
  const [formData, setFormData] = useState({
    title: initialValue || "",
  });

  const { addTrip, error, loading } = useAddTrip();

  const { currentUser } = useAuth();

  console.log("initialValue", initialValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("AddNewTrip: formData", formData);

    if (!currentUser) {
      return;
    }
    if (!initialValue) {
      try {
        await addTrip({ title: formData.title, userId: currentUser.uid });
      } catch (err) {
        if (err instanceof FirebaseError) {
          console.error(err.message);
        } else if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Could not add new trip, something went wrong..");
        }
      }
    } else if (initialValue) {
      const data: TripTextData = { title: formData.title };
      try {
        const tripDocRef = doc(db, "trips", id as string);

        await updateDoc(tripDocRef, {
          title: data.title,
        });
        console.log(
          `Trip with ID: ${id} has been updated with title: ${data.title}`
        );
      } catch (err) {
        console.error("Error updating trip:", err);
      }
    }

    closeDialog();
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={closeDialog}
        fullScreen={isMobile}
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
            fontSize: "1.5rem",
            textAlign: "center",
            marginBottom: 2,
            paddingTop: 4,
          }}
        >
          {initialValue ? "Update trip" : "Add new trip"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Trip Name"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              variant="outlined"
              required
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Button
            onClick={closeDialog}
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
            type="submit"
            variant="contained"
            className="btn-primary"
            color="primary"
            aria-label={initialValue ? "Save" : "Add"}
            title={initialValue ? "Save" : "Add"}
            sx={{
              borderRadius: 2,
            }}
          >
            {initialValue ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddNewTrip;
