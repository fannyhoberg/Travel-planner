import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const { id } = useParams();

  const { data: trip, isError, isLoading } = useGetTrip(id);

  const addNewList = () => {
    setAddNewTripDialog(true);
  };

  const handleSubmitNewList = () => {
    console.log("Clicked on add new list");
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}

      {!isLoading && !isError && (
        <Container maxWidth="sm">
          <Typography variant="h3">{trip?.title}</Typography>
          <Box sx={{ mt: 4 }}>
            <Button onClick={addNewList} className="btn-primary">
              Add list
            </Button>
          </Box>
          {addNewListDialog && (
            <ClickAwayListener onClickAway={() => setAddNewTripDialog(false)}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                component="form"
                onSubmit={handleSubmitNewList}
              >
                <TextField
                  label="Name list"
                  name="new-list"
                  type="text"
                  variant="standard"
                  required
                  sx={{ flex: 1 }}
                />
                <Button
                  sx={{ marginLeft: 1 }}
                  endIcon={<AddIcon />}
                  variant="text"
                  type="submit"
                ></Button>
              </Box>
            </ClickAwayListener>
          )}
        </Container>
      )}
    </>
  );
};

export default TripPage;
