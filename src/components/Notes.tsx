import { Box, TextField, Button } from "@mui/material";
import { Trip } from "../types/trip";
import { useState } from "react";
import { useHandleTrip } from "../hooks/useHandleTrip";

type NotesProp = {
  id: string | undefined;
  trip: Trip | null;
};

const Notes = ({ id, trip }: NotesProp) => {
  const [localNotes, setLocalNotes] = useState<string>("");
  const [isNotesChanged, setIsNotesChanged] = useState(false);

  const { updateTripNotes } = useHandleTrip(id, trip);

  const handleSaveNotes = async () => {
    if (!trip) return;

    await updateTripNotes(localNotes);
    setIsNotesChanged(false);
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 3,
        }}
      >
        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={4}
          value={isNotesChanged ? localNotes : trip?.notes || ""}
          onChange={(e) => {
            setLocalNotes(e.target.value);
            setIsNotesChanged(true);
          }}
          sx={{ mt: 2, backgroundColor: "#FFFFFF" }}
        />
      </Box>
      {isNotesChanged && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            title="Save"
            aria-label="Save notes"
            onClick={handleSaveNotes}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#2a3132",
              mt: 2,
              alignSelf: "flex-end",
            }}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Notes;
