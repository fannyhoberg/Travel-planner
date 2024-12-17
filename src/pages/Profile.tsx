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
import BackButton from "../components/BackButton";

const ProfilePage = () => {
  const [updateProfile, setUpdateProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    currentUser,
    userEmail,
    userName,
    deleteAccount,
    reauthenticateUser,
  } = useAuth();

  const { data: user, isLoading } = useGetUser(currentUser?.uid);
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
    setLoading(true);
    try {
      await reauthenticateUser(password);
      if (user && user?.length > 0) {
        const userDoc = user[0];
        const docRef = doc(db, "users", userDoc._id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const storedUid = docData?._id;
          if (storedUid === currentUser?.uid) {
            await deleteUser(userDoc._id);
          } else {
            console.error("You cannot delete another user's account.");
          }
        }
      }
      await deleteAccount();

      navigate("/");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setIsError(`Firebase Error: ${err.message}`);
      } else if (err instanceof Error) {
        setIsError(`Error: ${err.message}`);
      } else {
        setIsError("Could not delete profile, something went wrong..");
      }
    }
    setLoading(false);
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
        <BackButton />

        {!updateProfile && (
          <>
            {isLoading && <Typography>Loading...</Typography>}
            {loading && <Typography>Loading...</Typography>}

            {isError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {isError}
              </Typography>
            )}

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
