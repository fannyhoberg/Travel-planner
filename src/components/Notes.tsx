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
          id="outlined-multiline-static"
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
        <Button
          variant="contained"
          className="btn-primary"
          title="Save"
          aria-label="Save notes"
          onClick={handleSaveNotes}
          sx={{ color: "#835d23", mt: 2, alignSelf: "flex-end" }}
        >
          Save
        </Button>
      )}
    </Box>
  );
};

export default Notes;
