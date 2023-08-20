import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@mui/material";
import SingleChat from "../UserAvatar/SingleChat";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        padding: "3px",
        margin: "2px 7px 2px",
        background: "linear-gradient(#6527BE, #9681EB, #45CFDD)",
        width: { xs: "100%", md: "70%" },
        color: "black",
        borderRadius: "4px",
        borderWidth: "2px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
