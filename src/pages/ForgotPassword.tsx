import useAuth from "../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import BackButton from "../components/BackButton";
import {
  Box,
  Button,
  Container,
  Snackbar,
  SnackbarContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
  });
  const { resetPassword } = useAuth();

  const [isSuccessSnackbar, setIsSuccessSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { open, vertical, horizontal } = isSuccessSnackbar;

  const handleCloseSnackbar = () => {
    setIsSuccessSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPassword(formData.email);
      setIsSuccessSnackbar({
        open: true,
        vertical: "top",
        horizontal: "right",
      });
    } catch (err) {
      if (err instanceof FirebaseError) {
        setIsError(err.message);
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(
          "Could not submit reset password request, something went wrong.."
        );
      }
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <BackButton />
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Typography variant="h5">Reset password</Typography>
          <Typography>
            Enter your email and you'll get a password reset link in your inbox!
          </Typography>
        </Stack>
        <Box sx={{ mt: 4, p: 5 }} component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="standard"
            required
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />

          <Button
            disabled={isSubmitting}
            sx={{ mt: 4 }}
            type="submit"
            className="btn-primary"
            variant="contained"
          >
            Send
          </Button>
          {!isError && !isSubmitting && (
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              key={vertical + horizontal}
              autoHideDuration={5000}
              onClose={handleCloseSnackbar}
            >
              <SnackbarContent
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
                message="An email has been sent to you, check out your inbox!"
              />
            </Snackbar>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
