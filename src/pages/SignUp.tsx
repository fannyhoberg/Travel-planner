import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FirebaseError } from "firebase/app";
import BackButton from "../components/BackButton";
import Snackbar from "@mui/material/Snackbar";
import useAddDocument from "../hooks/useAddDocument";
import { userCol } from "../services/firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
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
  const { addDocument, loading } = useAddDocument();

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

    setIsLoading(true);
    try {
      const userCred = await signup(formData.email, formData.password);
      const user = userCred.user;

      await addDocument(userCol, {
        _id: user.uid,
        email: user.email || "",
      });

      setIsError(null);

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
        setIsError(err.message);
      } else if (err instanceof Error) {
        setIsError(err.message);
      } else {
        setIsError("Could not create account, something went wrong..");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <BackButton to="/" />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h2">Create account</Typography>
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            aria-label="email"
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
            aria-label="password"
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
            aria-label="Confirm password"
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
            disabled={isLoading}
            sx={{ mt: 4 }}
            type="submit"
            className="btn-primary"
            variant="contained"
            aria-label="Create account"
            title="Create account"
          >
            Create
          </Button>
        </Box>
        {isLoading && <LoadingSpinner />}
        {loading && <LoadingSpinner />}

        {isError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {isError}
          </Typography>
        )}
        {!isLoading && !isError && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            onClose={handleCloseSnackbar}
            message="Account successfully created!"
            key={vertical + horizontal}
            sx={{ backgroundColor: "FFFFF", borderBlockColor: "white" }}
          />
        )}
      </Container>
    </>
  );
};

export default SignUp;
