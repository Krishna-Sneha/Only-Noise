import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SearchLoading } from "../chatPageComponents/SearchLoading";
import { GetSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import axios from "axios";

function MyChats({ fetchAgain }) {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:7000/api/chat",
        config
      );

      setChats(data);

      (await chats.length) > 0;
      while (chats.length < 0) {
        console.log("waiting");
      }
    } catch (error) {
      console.log("Err faced:");
      console.log(error);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        sx={{
          display: { xs: selectedChat ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          padding: "3px",
          margin: "2px",
          background: "white",
          color: "black",
          width: { xs: "100%", sm: "100%", md: "30%" },
          borderRadius: "4px",
          borderWidth: "2px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "3px",
            fontSize: { xs: "20px", sm: "28px", md: "30px" },
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          My Chats
          <GroupChatModal>
            <Button
              variant="outlined"
              sx={{
                color: "black",
                borderColor: "black",
                "&:hover": { background: "#E8E8E8", borderColor: "black" },
                fontSize: { xs: "10px", sm: "12px", md: "17px" },
                fontFamily: "Indie Flower, cursive",
              }}
              size="small"
            >
              Create New Group
              <Box>
                <AddIcon />
              </Box>
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "3px",
            background: "linear-gradient(#6527BE, #9681EB, #45CFDD)",
            width: "100%",
            height: "100%",
            borderRadius: "5px",
            overflowY: "hidden",
          }}
        >
          {chats ? (
            <Stack
              sx={{
                overflowY: "scroll",
              }}
            >
              {console.log(chats) ||
                chats.map((chat) => (
                  <Box
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                    sx={{
                      cursor: "pointer",
                      background: selectedChat === chat ? "#504099" : "#E8E8E8",
                      color: selectedChat === chat ? "white" : "black",
                      padding: "3%",
                      borderRadius: "5px",
                      margin: "5px",
                    }}
                  >
                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        fontFamily: "Indie Flower, cursive",
                        fontSize: "20px",
                      }}
                    >
                      {chat.isGroupChat == true
                        ? chat.chatName
                        : chat.users.length > 1 &&
                          GetSender(loggedUser, chat.users)}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          ) : (
            <SearchLoading />
          )}
        </Box>
      </Box>
    </>
  );
}

export default MyChats;
