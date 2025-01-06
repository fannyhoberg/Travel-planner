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

type InviteFriendFormDialogProps = {
  onClose: () => void;
  handleInviteFriend: (id: string | undefined, email: string) => void;
};

const InviteFriendFormDialog = ({
  handleInviteFriend,
  onClose,
}: InviteFriendFormDialogProps) => {
  const [friendEmail, setFriendEmail] = useState("");
  const [isError, setIsError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getUserByEmail, isLoading, error } = useGetUserByEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (friendEmail.trim() === "") {
      alert("Please enter an email address");
      return;
    }

    try {
      const user = await getUserByEmail(friendEmail);

      if (!user) {
        setIsError("No user found with this email address");
        return;
      }

      handleInviteFriend(user.id, user.email);
    } catch (err) {
      setIsError("No user found with this email address");
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
        Invite friend to share trip
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
          <TextField
            label="Friend email adress"
            onChange={(e) => setFriendEmail(e.target.value)}
            variant="standard"
            required
            sx={{
              maxWidth: isMobile ? "450px" : "600px",
              width: "100%",
              mb: 2,
            }}
          />
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
              className="btn-primary"
              aria-label="Invite friend"
              title="Invite friend"
              sx={{
                borderRadius: 2,
              }}
            >
              Invite
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendFormDialog;
