import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

type ConfirmationModalProps = {
  children: React.ReactNode;
  onOpen: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  children,
  onOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmationModalProps) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "0.5px solid lightgray",
    boxShadow: 5,
    p: 4,
  };
  return (
    <Modal
      open={onOpen}
      onClose={onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
          {children}
        </Typography>
        <Button
          className="btn-secondary"
          aria-label="Cancel"
          title="Cancel"
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          aria-label="Confirm"
          title="Confirm"
          className="btn-primary"
          variant="contained"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
