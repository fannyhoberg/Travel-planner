import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import useGetUserByEmail from "../hooks/useGetUserByEmail";
import { AllowedUserData } from "../types/trip";

type InviteFriendFormDialogProps = {
  onClose: () => void;
  handleInviteFriend: (id: string | undefined, email: string) => void;
  handleRemoveFriend?: (id: string) => void;
  user?: AllowedUserData;
};

const InviteFriendFormDialog = ({
  handleInviteFriend,
  handleRemoveFriend,
  onClose,
  user,
}: InviteFriendFormDialogProps) => {
  const [friendEmail, setFriendEmail] = useState("");
  const [isError, setIsError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getUserByEmail, isLoading, error } = useGetUserByEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.email != "") {
      if (handleRemoveFriend && user?.id) {
        handleRemoveFriend(user?.id);
        onClose();
      }
    } else {
      if (friendEmail.trim() === "") {
        setIsError("Please enter an email address");
        return;
      }

      try {
        const foundUser = await getUserByEmail(friendEmail);

        if (!foundUser) {
          setIsError("No user found with this email address");
          return;
        }

        handleInviteFriend(foundUser.id, foundUser.email);
        onClose();
      } catch (err) {
        setIsError("An error occurred while finding the user.");
      }
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={isMobile}
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          maxWidth: isMobile ? "100%" : "400px",
          minWidth: isMobile ? "100%" : "300px",
          maxHeight: isMobile ? "100%" : "500px",
          padding: 2,
          margin: isMobile ? 0 : "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          textAlign: "center",
          paddingTop: 4,
        }}
      >
        {user?.email != "" ? "Handle friend" : "Invite friend"}
      </DialogTitle>
      <DialogContent>
        {user?.email === "" && (
          <Typography variant="body2">
            Your friend needs to have an account on Vista.
          </Typography>
        )}
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          {user?.email === "" && (
            <TextField
              label="Enter email adress"
              onChange={(e) => setFriendEmail(e.target.value)}
              variant="standard"
              required
              sx={{
                maxWidth: isMobile ? "450px" : "600px",
                width: "100%",
                mb: 2,
              }}
            />
          )}
          {user?.email != "" && (
            <Box padding={3} marginBottom={3}>
              <Typography>
                Do you want to remove {user?.email} from this trip?
              </Typography>
            </Box>
          )}
          {error && (
            <Typography variant="body2" sx={{ color: "red" }}>
              {error}
            </Typography>
          )}
          {isError && (
            <Typography variant="body2" sx={{ color: "red" }}>
              {isError}
            </Typography>
          )}
          {isLoading && (
            <Typography variant="body2" sx={{ color: "#666868" }}>
              Searching for user...
            </Typography>
          )}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Button
              onClick={onClose}
              color="secondary"
              variant="outlined"
              className="btn-secondary"
              aria-label="Cancel"
              title="Cancel"
              sx={{
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              type="submit"
              className={user?.email != "" ? "btn-delete" : "btn-primary"}
              aria-label={
                user?.email != "" ? "Remove friend from trip" : "Invite friend"
              }
              title={user?.email != "" ? "Remove friend" : "Invite friend"}
              sx={{
                borderRadius: 2,
              }}
            >
              {user?.email != "" ? "Remove" : "Invite"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendFormDialog;
