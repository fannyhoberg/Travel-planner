import {
  Box,
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useGetUserDoc from "../hooks/useGetUserDoc";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { FirebaseError } from "firebase/app";
import LoadingSpinner from "./LoadingSpinner";

type UpdateProfileProps = {
  onClose: () => void;
};

const UpdateProfile = ({ onClose }: UpdateProfileProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    currentUser,
    reloadUser,
    setDisplayName,
    setEmail,
    setPassword,
    userEmail,
    userName,
  } = useAuth();

  const { data: userData, isLoading } = useGetUserDoc(currentUser?.uid);

  const userId = userData && userData.length > 0 ? userData[0]._id : null;
  const userDocRef = userId ? doc(db, "users", userId) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setCheckPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setCheckPassword(true);
      return;
    }
    setLoading(true);
    try {
      setIsSubmitting(true);
      if (userDocRef) {
        if (formData.email !== userEmail) {
          await setEmail(formData.email);
        }

        if (formData.name !== userName) {
          await setDisplayName(formData.name);
          await updateDoc(userDocRef, { name: formData.name });
        }

        if (formData.password) {
          await setPassword(formData.password);
        }
        reloadUser();
      }
      setIsSuccessSnackbar({
        open: true,
        vertical: "top",
        horizontal: "right",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setIsError(err.message);
      } else if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("Could not create account, something went wrong..");
      }
    }
    setIsSubmitting(false);
    setLoading(false);
  };
  const [isSuccessSnackbar, setIsSuccessSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { open, vertical, horizontal } = isSuccessSnackbar;

  const handleCloseSnackbar = () => {
    setIsSuccessSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    setFormData({
      ...formData,
      name: userName ? userName : "",
      email: userEmail ? userEmail : "",
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4">Update profile</Typography>
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          {isLoading && <LoadingSpinner />}
          {loading && <LoadingSpinner />}

          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {isError}
            </Typography>
          )}

          <TextField
            label="Name"
            name="name"
            variant="standard"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="standard"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="standard"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            variant="standard"
            fullWidth
            value={formData.confirmPassword}
            helperText={
              checkPassword ? (
                <Typography variant="caption" sx={{ color: "red" }}>
                  Password does not match
                </Typography>
              ) : null
            }
            onChange={handleChange}
          />
          <Button
            sx={{ mt: 4, mr: 4 }}
            type="submit"
            className="btn-secondary"
            variant="text"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            sx={{ mt: 4 }}
            type="submit"
            className="btn-primary"
            variant="contained"
          >
            Save
          </Button>
        </Box>
        {!isError && !loading && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            onClose={handleCloseSnackbar}
            message="Profile successfully updated!"
            key={vertical + horizontal}
            sx={{ backgroundColor: "F5F5F5", borderBlockColor: "black" }}
          />
        )}
      </Container>
    </>
  );
};

export default UpdateProfile;
