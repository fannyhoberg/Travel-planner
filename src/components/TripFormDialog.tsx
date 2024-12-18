import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import useAddTrip from "../hooks/useAddTrip";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import useAuth from "../hooks/useAuth";
import { TripTextData } from "../types/trip";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  isMobile: boolean;
  closeDialog: () => void;
  initialValue?: string;
  id?: string | null;
};

const TripFormDialog = ({ isMobile, closeDialog, initialValue, id }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialValue || "",
  });

  const {
    addTrip,
    error: addTripError,
    loading: addTripLoading,
  } = useAddTrip();

  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!currentUser) {
      return;
    }
    if (!initialValue) {
      try {
        await addTrip({ title: formData.title, userId: currentUser.uid });
      } catch (err) {
        if (err instanceof FirebaseError) {
          setIsError(err.message);
        } else if (err instanceof Error) {
          setIsError(err.message);
        } else {
          setIsError("Could not add new trip, something went wrong..");
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
        if (err instanceof FirebaseError) {
          setIsError(err.message);
        } else if (err instanceof Error) {
          setIsError(err.message);
        } else {
          setIsError("Could not add new trip, something went wrong..");
        }
      }
    }
    setIsLoading(false);

    closeDialog();
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={closeDialog}
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
                className="btn-primary"
                aria-label={initialValue ? "Save" : "Add"}
                title={initialValue ? "Save" : "Add"}
                disabled={isLoading ? true : false}
                sx={{
                  borderRadius: 2,
                }}
              >
                {initialValue ? "Save" : "Add"}
              </Button>
            </DialogActions>
            {isError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {isError}
              </Typography>
            )}
            {addTripError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {addTripError}
              </Typography>
            )}
          </Box>
        </DialogContent>

        {isLoading && <LoadingSpinner />}
        {addTripLoading && <LoadingSpinner />}
      </Dialog>
    </>
  );
};

export default TripFormDialog;
