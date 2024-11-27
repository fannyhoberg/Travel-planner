import { Box, Button, TextField, Typography } from "@mui/material";
import useAddTrip from "../hooks/useAddTrip";
import { NewTrip } from "../types/trip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import useAuth from "../hooks/useAuth";

type Props = {
  isMobile: boolean;
  onClose: () => void;
};

const AddNewTrip = ({ isMobile, onClose }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
  });

  const { addTrip, error, loading } = useAddTrip();

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("AddNewTrip: formData", formData);

    if (!currentUser) {
      return;
    }
    try {
      await addTrip({ title: formData.title, userId: currentUser.uid });
      navigate("/home");
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Could not add new trip, something went wrong..");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: isMobile ? 0 : "50%",
          left: isMobile ? 0 : "50%",
          width: isMobile ? "100%" : "30%",
          height: isMobile ? "100%" : "40%",
          backgroundColor: "#F5F5F5",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-start",
          padding: isMobile ? "20px" : "40px",
          ...(isMobile
            ? {}
            : {
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
                boxShadow: 2,
              }),
        }}
      >
        {/* Close button */}
        <Button
          variant="text"
          sx={{
            position: "absolute",
            top: isMobile ? 20 : 10,
            right: isMobile ? 20 : 10,
            padding: 0,
            color: "black",
          }}
          onClick={onClose}
        >
          X
        </Button>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Where we going?
        </Typography>

        <Box
          sx={{ mt: 4, p: isMobile ? 2 : 5 }}
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Name your trip"
            name="title"
            type="text"
            variant="standard"
            required
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />

          <Button
            variant="text"
            type="submit"
            className="btn-primary"
            sx={{ mt: 4 }}
          >
            Create
          </Button>
        </Box>
      </Box>
      {error && <div>{error}</div>}
      {loading && <div>{loading}</div>}
      {/* Blurred background */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(0.5px)",
            zIndex: 1200,
          }}
        />
      )}
    </>
  );
};

export default AddNewTrip;
