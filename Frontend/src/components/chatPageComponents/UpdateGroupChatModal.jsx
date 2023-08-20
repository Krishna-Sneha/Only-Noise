import {
  Box,
  Modal,
  Typography,
  Button,
  Chip,
  TextField,
  CircularProgress,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { UserListItem } from "../UserAvatar/UserListItem";

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

export const UpdateGroupChatModal = ({
  groupChat,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupRenameLoading, setGroupRenameLoading] = useState(false);

  const HandleRename = async () => {
    console.log(groupChat.chatName, groupChatName);
    if (!groupChatName) {
      alert("group chat name empty!");
      return;
    }
    try {
      setGroupRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:7000/api/chat/rename",
        {
          currentGroupId: groupChat._id,
          newGroupName: groupChatName,
        },
        config
      );

      console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupRenameLoading(false);
      handleClose();
      setGroupChatName("");
    } catch (err) {
      console.log(err);
      setGroupRenameLoading(false);
    }
  };

  const HandleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:7000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddUser = async (userToBeAdded) => {
    if (!userToBeAdded) {
      alert("no user selected!");
      return;
    }

    if (selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      alert("user already exists!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("only admins can remove!");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:7000/api/chat/add",
        {
          groupId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveUser = async (userToBeRemoved) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      user._id !== userToBeRemoved._id
    ) {
      alert("only group admin can remove!");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:7000/api/chat/remove",
        {
          groupId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );

      userToBeRemoved._id === user._id
        ? setSelectedChat("")
        : setSelectedChat(data);

      fetchMessages();
      setFetchAgain(!fetchAgain);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <VisibilityIcon onClick={handleOpen} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textTransform: "capitalize" }}
            >
              {groupChat.chatName}
            </Typography>
            {groupChat.users.map((user) => {
              return (
                <Chip
                  key={user._id}
                  sx={{ background: "black", color: "white", margin: "3px" }}
                  label={user.name}
                  onClick={() => handleRemoveUser(user)}
                />
              );
            })}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                sx={{ mt: 2 }}
                value={groupChatName}
                placeholder="Chat Name"
                onChange={(event) => {
                  setGroupChatName(event.target.value);
                }}
              ></TextField>
              <LoadingButton
                sx={{ mx: 2, mt: 1 }}
                size="small"
                onClick={() => HandleRename()}
                loading={groupRenameLoading}
              >
                Update
              </LoadingButton>
            </Box>

            <Box>
              <TextField
                sx={{ my: 2, width: "100%" }}
                placeholder="Add users to group"
                onChange={(event) => {
                  HandleSearch(event.target.value);
                }}
              ></TextField>

              {/* <UserListItem user={user} onClick/> */}
              {loading ? (
                <div>
                  <CircularProgress />
                </div>
              ) : (
                searchResults?.slice(0, 3).map((searchResultUser) => {
                  return (
                    <UserListItem
                      key={searchResultUser._id}
                      user={searchResultUser}
                      handleFunction={() => {
                        handleAddUser(searchResultUser);
                      }}
                    />
                  );
                })
              )}
            </Box>

            <Button
              sx={{
                textAlign: "center",
                padding: "2%",
                margin: "2px auto",
                display: "flex",
                color: "white",
                background: "red",
                "&:hover": {
                  background: "rgb(163, 5, 5)",
                },
                textTransform: "capitalize",
              }}
              onClick={() => handleRemoveUser(user)}
              variant="contained"
            >
              Leave Group
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};
