import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import BackButton from "../components/BackButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted Data:", formData);

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);

      // Navigate to start page as logged in
      navigate("/home");
    } catch (err) {
      setIsError(true);
      if (err instanceof FirebaseError) {
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Could not log you in, something went wrong..");
      }
    }
    setIsSubmitting(false);
  };

  const handleResetPassword = () => {
    navigate("/forgot-password");
  };
  return (
    <>
      <BackButton to="/" />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h2">Log in</Typography>
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
          {isError && (
            <Typography style={{ color: "red" }}>
              Email or password incorrect, try again.
            </Typography>
          )}

          <Button
            disabled={isSubmitting}
            sx={{ mt: 4 }}
            type="submit"
            className="btn-primary"
            variant="contained"
            aria-label="Log in"
            title="Log in"
          >
            Log in
          </Button>
        </Box>
        <Button
          type="submit"
          className="btn-text-black"
          aria-label="Forgot password"
          title="Forgot password"
          onClick={handleResetPassword}
        >
          Forgot password?
        </Button>
      </Container>
    </>
  );
};

export default Login;
