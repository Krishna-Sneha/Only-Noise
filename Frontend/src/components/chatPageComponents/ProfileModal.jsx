import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ChatState } from "../../Context/ChatProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ProfileModal({ user, children }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div>
        {children ? (
          <span onClick={handleOpen}>{children}</span>
        ) : (
          <VisibilityIcon onClick={handleOpen} />
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h"
              component="h2"
              style={{
                textAlign: "center",
                textTransform: "capitalize",
                padding: "4%",
              }}
            >
              {user.name}
            </Typography>

            <img
              id="modal-modal-description"
              borderRadius="full"
              src={
                user.dp
                  ? user.dp
                  : "https://cdn3.iconfinder.com/data/icons/dashboard-ui-element/32/Dashboard_icon_design_expanded-28-512.png"
              }
              alt={user.name}
              style={{
                width: "210px",
                height: "200px",
                borderRadius: "50%",
                display: "block",
                margin: "3% auto",
                padding: "2%",
              }}
            ></img>

            <Typography
              id="modal-modal-description"
              style={{
                textAlign: "center",
                padding: "2%",
                fontFamily: "Indie Flower, cursive",
                fontSize: "20px",
              }}
            >
              {user.email}
            </Typography>
            <Button
              onClick={handleClose}
              variant="contained"
              style={{
                display: "block",
                float: "right",
                padding: "2%",
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default ProfileModal;
