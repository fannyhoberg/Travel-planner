import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import UpdateProfile from "../components/UpdateProfile";
import { FirebaseError } from "firebase/app";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import useGetUser from "../hooks/useGetUser";
import useHandleUser from "../hooks/useHandleUser";
import { doc, getDoc } from "firebase/firestore";

const ProfilePage = () => {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const {
    currentUser,
    userEmail,
    userName,
    deleteAccount,
    reauthenticateUser,
  } = useAuth();

  const { data: user } = useGetUser(currentUser?.uid);
  const { deleteUser } = useHandleUser();

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
      if (user && user?.length > 0) {
        const userDoc = user[0];
        const docRef = doc(db, "users", userDoc._id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const storedUid = docData?._id;

          console.log("Stored UID in document:", storedUid);

          console.log("currentUser?.uid", currentUser?.uid);

          if (storedUid === currentUser?.uid) {
            console.log("UID matchade! Raderar dokument.");
            console.log("userDoc._id", userDoc._id);

            await deleteUser(userDoc._id);
          } else {
            console.error("You cannot delete another user's account.");
          }
        }
      }
      navigate("/");
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
      name: userName ? userName : "",
      email: userEmail ? userEmail : "",
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        {!updateProfile && (
          <>
            {/* {error && <div>{error}</div>}
            {isLoading && <div>Deleting account...</div>} */}

            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "0.1px solid lightgray",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4">My Profile</Typography>
              </Box>

              <Stack
                spacing={2}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    Name:
                  </Typography>
                  <Typography variant="subtitle1">
                    {formData.name || "Not set"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    Email:
                  </Typography>
                  <Typography variant="subtitle1">
                    {currentUser?.email || "Not available"}
                  </Typography>
                </Box>
              </Stack>
              <Button
                type="submit"
                sx={{ mt: 4, mr: 4 }}
                className="btn-delete"
                variant="contained"
                aria-label="Delete account"
                title="Delete account"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete account
              </Button>
              <Button
                type="submit"
                sx={{ mt: 4 }}
                className="btn-primary"
                variant="contained"
                aria-label="Update profile"
                title="Update profile"
                onClick={() => setUpdateProfile(true)}
              >
                Update profile
              </Button>
              <ConfirmationModal
                onOpen={showDeleteModal}
                onConfirm={handleDeleteProfile}
                onCancel={() => setShowDeleteModal(false)}
              >
                Sure you want to delete this account?
              </ConfirmationModal>
            </Box>
          </>
        )}
        {updateProfile && <UpdateProfile onClose={exitUpdate} />}
      </Container>
    </>
  );
};

export default ProfilePage;
