import { Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import UpdateProfile from "../components/UpdateProfile";
import { FirebaseError } from "firebase/app";

const ProfilePage = () => {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    currentUser,
    userEmail,
    userName,
    deleteAccount,
    reauthenticateUser,
  } = useAuth();

  const exitUpdate = () => {
    setUpdateProfile(false);
  };

  const handleDeleteProfile = async () => {
    const password = prompt(
      "Please enter your password to confirm account deletion:"
    );

    if (!password) {
      console.error("Password is required to delete the account.");
      return;
    }

    try {
      await reauthenticateUser(password);
      await deleteAccount();
      console.log("Account deleted successfully.");
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error(`Firebase Error: ${err.message}`);
      } else if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      name: userName ? userName : "No name",
      email: userEmail ? userEmail : "",
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        {!updateProfile && (
          <>
            <Typography variant="h4">My profile</Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Email: {currentUser?.email}</Typography>
            <Button
              type="submit"
              sx={{ mt: 4, mr: 4 }}
              className="btn-delete"
              variant="contained"
              onClick={handleDeleteProfile}
            >
              Delete account
            </Button>
            <Button
              type="submit"
              sx={{ mt: 4 }}
              className="btn-primary"
              variant="contained"
              onClick={() => setUpdateProfile(true)}
            >
              Update profile
            </Button>
          </>
        )}
        {updateProfile && <UpdateProfile onClose={exitUpdate} />}
      </Container>
    </>
  );
};

export default ProfilePage;
