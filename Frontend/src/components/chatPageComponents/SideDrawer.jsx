import React, { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Button,
  Tooltip,
  Fade,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Drawer,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { ChatState } from "../../Context/ChatProvider";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { SearchLoading } from "../chatPageComponents/SearchLoading";
import { UserListItem } from "../UserAvatar/UserListItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { GetSender } from "../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";

function SideDrawer() {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorBasicMenu, setAnchorBasicMenu] = React.useState(null);
  const openBasicMenu = Boolean(anchorBasicMenu);
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = async () => {
    if (!search) {
      return alert("Nothing inside search!");
    }
    try {
      setLoading(true);
      // console.log(`Bearer ${user.token}`);

      const config = {
        "Content-Type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // console.log(config);
      const { data } = await axios.get(
        `http://localhost:7000/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      alert("Error occurred: " + err);
      console.log(err);
    }
  };

  const AccessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:7000/api/chat",
        { userId },
        config
      );
      setLoadingChat(false);

      if (!chats.find((chat) => chat._id === data._id))
        setChats([data, ...chats]);

      setSelectedChat(data);
      setSearchResults([]);
      setSearch("");

      setIsDrawerOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    setAnchorEl(null);
  };

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderradius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "black",
          padding: "5px 5px 5px 5px",
          borderWidth: "5px",
        }}
      >
        <Tooltip
          title="Search for users"
          arrow
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <span>
            <Button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              style={{ color: "white", textTransform: "capitalize" }}
            >
              <SearchIcon />
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none  ", sm: "none", md: "block" },
                  px: "5%",
                  fontFamily: "Indie Flower, cursive",
                  fontSize: "20px",
                }}
              >
                Search
              </Typography>
            </Button>
          </span>
        </Tooltip>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Indie Flower, cursive",
            fontSize: "30px",
            fontWeight: "bolder",
          }}
        >
          Only-Noise
        </Typography>
        {/* BELL ICON */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <NotificationBadge
            count={notification.length}
            effect={Effect.SCALE}
          />
          <NotificationsIcon
            sx={{ cursor: "pointer", margin: "10%", marginRight: "15%" }}
            onClick={(event) => setAnchorBasicMenu(event.currentTarget)}
          />

          <Menu
            anchorEl={anchorBasicMenu}
            open={openBasicMenu}
            onClose={() => setAnchorBasicMenu(null)}
          >
            <MenuItem sx={{ display: "block" }}>
              {!notification.length && "No new messages"}
              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  sx={{
                    display: "block",
                    border: "1px solid black",
                    "&:hover": { background: "black", color: "white" },
                  }}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n._id != notif._id)
                    );
                    setAnchorBasicMenu(null);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${GetSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuItem>
          </Menu>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="none"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            <Avatar alt={user.name} src={user.dp} />
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <ProfileModal user={user}>
              <MenuItem
                disableRipple
                sx={{ fontFamily: "Indie Flower, cursive", fontSize: "22px" }}
              >
                My Profile
              </MenuItem>
            </ProfileModal>

            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={handleCloseLogout}
              disableRipple
              sx={{ fontFamily: "Indie Flower, cursive", fontSize: "22px" }}
            >
              Logout
            </MenuItem>
          </StyledMenu>
        </div>
      </Box>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
      >
        <Box p={2} width="250px" textAlign="center" role="presentation">
          <Typography
            sx={{ fontFamily: "Indie Flower, cursive", fontSize: "20px" }}
          >
            Search Users
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            padding: "3%",
            fontFamily: "Indie Flower, cursive",
            fontSize: "14px",
          }}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Search by name or mail"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            style={{ fontFamily: "Indie Flower, cursive", fontSize: "14px" }}
          />
          <Button
            onClick={handleSearch}
            sx={{ fontFamily: "Indie Flower, cursive", fontSize: "20px" }}
          >
            Go
          </Button>
        </Box>
        {loading ? (
          <SearchLoading />
        ) : (
          searchResults?.map((user) => {
            return (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => {
                  AccessChat(user._id);
                }}
              />
            );
          })
        )}
        {loadingChat && (
          <Box sx={{ display: "flex", margin: "auto" }}>
            <CircularProgress />
          </Box>
        )}
      </Drawer>
    </>
  );
}

export default SideDrawer;
