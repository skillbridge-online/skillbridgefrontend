import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import API from "./services";

const DuplicateTestModal = ({ open, handleClose, testLink }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(testLink);
    alert("Test link copied to clipboard!");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Test Duplicated Successfully!
        </Typography>
        <Typography sx={{ mt: 2, wordWrap: "break-word" }}>
          Share this link:  
          <strong style={{ color: "blue" }}>{testLink}</strong>
        </Typography>
        <Button
          onClick={copyToClipboard}
          startIcon={<ContentCopyIcon />}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Copy Link
        </Button>
      </Box>
    </Modal>
  );
};

export default DuplicateTestModal;
