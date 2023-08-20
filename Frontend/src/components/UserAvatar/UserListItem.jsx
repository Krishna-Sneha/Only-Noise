import { Box, Avatar, Typography } from "@mui/material";
import React from "react";

export function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        display: "flex",
        cursor: "pointer",
        padding: "3px",
        alignItems: "center",
        background: "#E8E8E8",
        margin: "3px",
        borderRadius: "10px",
        "&:hover": {
          background: "gray",
          transition: "background-color 0.3s ease-in-out",
          color: "white",
        },
      }}
    >
      <Avatar alt={user.name} src={user.dp} sx={{ paddingRight: "auto" }} />
      <Box>
        <Typography
          variant="subtitle1"
          style={{
            fontWeight: "bold",
            textTransform: "capitalize",
            fontFamily: "Indie Flower, cursive",
            fontSize: "18px",
          }}
        >
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Indie Flower, cursive", fontSize: "15px" }}
        >
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
