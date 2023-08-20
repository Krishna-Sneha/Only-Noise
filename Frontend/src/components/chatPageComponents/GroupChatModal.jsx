import React, { useState } from "react";
import {
  Box,
  Chip,
  Button,
  Typography,
  Modal,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

import { ChatState } from "../../Context/ChatProvider";

import { TextField } from "@mui/material";
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

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleAddMembers = async (query) => {
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

  const SelectedUser = (userToBeAdded) => {
    if (selectedUsers.includes(userToBeAdded)) {
      alert("user already exists!");
      return;
    }
    setSelectedUsers([...selectedUsers, userToBeAdded]);
    // console.log(selectedUsers);
  };

  const RemoveSelectedUser = (userToBeUnselected) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToBeUnselected._id)
    );
  };

  const handleCreateGroup = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the details!");
      return;
    }
    try {
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // console.log(JSON.stringify(selectedUsers.map((u) => u._id)));

      const { data } = await axios.post(
        "http://localhost:7000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      if (!chats.includes(data)) setChats([data, ...chats]);
      else {
        alert("already exists!");
      }
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Success!
        </Alert>
      </Snackbar>;
      setOpen(false);

      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h"
            component="h2"
            style={{
              textAlign: "center",
              textTransform: "capitalize",
              padding: "4%",
            }}
          >
            Create New Group
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Group Name..."
            value={groupChatName}
            onChange={(event) => {
              setGroupChatName(event.target.value);
            }}
          />

          <TextField
            variant="outlined"
            placeholder="Add members..."
            sx={{ width: "100%", margin: "10px auto" }}
            value={search}
            onChange={(event) => handleAddMembers(event.target.value.trim())}
          />

          {/* render selected Users */}
          {selectedUsers?.map((selectedUser) => {
            return (
              <Chip
                key={selectedUser._id}
                label={selectedUser.name}
                sx={{ background: "black", color: "white", margin: "3px" }}
                onClick={() => RemoveSelectedUser(selectedUser)}
              ></Chip>
            );
          })}
          {/* render searched users */}
          {loading ? (
            <div>loading...</div>
          ) : (
            searchResults?.slice(0, 3).map((searchResultUser) => {
              return (
                <UserListItem
                  key={searchResultUser._id}
                  user={searchResultUser}
                  handleFunction={() => {
                    SelectedUser(searchResultUser);
                  }}
                />
              );
            })
          )}
          <Button
            sx={{
              textAlign: "center",
              padding: "2%",
              margin: "2px auto",
              display: "flex",
              color: "white",
              background: "black",
            }}
            variant="contained"
            onClick={handleCreateGroup}
          >
            CREATE
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
