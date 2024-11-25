import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [checkPassword, setCheckPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setCheckPassword(false);
  };

  const onBack = () => {
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setCheckPassword(true);
      return;
    }
    console.log("Submitted Data:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Button onClick={onBack}>back</Button>

      <Typography variant="h4">Create account</Typography>
      <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
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
          onChange={handleChange}
        />
        {checkPassword && <Typography>Password does not match</Typography>}

        <Button
          sx={{ mt: 4 }}
          type="submit"
          className="btn-primary"
          variant="contained"
        >
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
