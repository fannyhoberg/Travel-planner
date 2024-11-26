import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import BackButton from "../components/BackButton";
import Snackbar from "@mui/material/Snackbar";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const [isSuccessSnackbar, setIsSuccessSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { open, vertical, horizontal } = isSuccessSnackbar;

  const handleCloseSnackbar = () => {
    setIsSuccessSnackbar((prev) => ({ ...prev, open: false }));
  };

  const { signup } = useAuth();

  const navigate = useNavigate();

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
    console.log("Submitted Data:", formData);

    setIsSubmitting(true);
    try {
      await signup(formData.email, formData.password);

      setIsSuccessSnackbar({
        open: true,
        vertical: "top",
        horizontal: "right",
      });

      // Navigate to start page as logged in
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Could not create account, something went wrong..");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <BackButton to="/" />
      <Container maxWidth="sm">
        <Typography variant="h4">Create account</Typography>
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="standard"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
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
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="standard"
            required
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            variant="standard"
            required
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
            disabled={isSubmitting}
            sx={{ mt: 4 }}
            type="submit"
            className="btn-primary"
            variant="contained"
          >
            Create
          </Button>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={handleCloseSnackbar}
          message="Account successfully created!"
          key={vertical + horizontal}
          sx={{ backgroundColor: "F5F5F5", borderBlockColor: "black" }}
        />
      </Container>
    </>
  );
};

export default SignUp;
