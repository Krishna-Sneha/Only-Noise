import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { GetFullSender, GetSender } from "../config/ChatLogics";
import ProfileModal from "../chatPageComponents/ProfileModal";
import { UpdateGroupChatModal } from "../chatPageComponents/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import { ScrollableChat } from "../chatPageComponents/ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../images/typingHands.json";
import MicIcon from "@mui/icons-material/Mic";

const ENDPOINT = "http://localhost:7000";

var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [micOn, setMicOn] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const sendMessage = async (event) => {
    socket.emit("stop typing", selectedChat._id);
    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      try {
        const config = {
          "Content-Type": "application/json",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:7000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const FetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);

      const config = {
        "Content-Type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:7000/api/message/${selectedChat._id}`,
        config
      );

      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const TypingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timeLength = 4000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var diff = timeNow - lastTypingTime;
      if (diff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  const GetVoiceTyped = () => {
    setMicOn(!micOn);
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    console.log({ recognition });
    recognition.interimResults = true;

    recognition.addEventListener("result", (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript);
      console.log(transcript.toString());
      setNewMessage(transcript.toString());
    });
    if (true) recognition.start();
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <ChevronLeftIcon
              sx={{
                display: { sm: "flex", md: "none" },
                float: "left",
                border: "1px solid gray",
                borderRadius: "15%",
                width: "35px",
                height: "35px",
                margin: "3px",
                "&:hover": {
                  background: "#E8E8E8",
                  borderRadius: "15%",
                },
              }}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            <Typography
              sx={{
                padding: "3px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: { sm: "space-between" },
                fontSize: { sm: "28px", md: "35px" },
                flexDirection: "column",
              }}
            >
              {!selectedChat.isGroupChat ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                >
                  <div>{GetSender(user, selectedChat.users)}</div>
                  <ProfileModal
                    sx={{ float: "right" }}
                    user={GetFullSender(user, selectedChat.users)}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div>{selectedChat.chatName.toUpperCase()}</div>
                  <div>
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={FetchMessages}
                      sx={{ float: "right" }}
                      groupChat={selectedChat}
                    />
                  </div>
                </Box>
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "95%",
              height: "87%",
              background: "#E8E8E8",
              margin: "3px",
              padding: "3px",
              flexDirection: "column",
              justifyContent: "flex-end",
              borderRadius: "5px",
              overflowY: "hidden",
              fontFamily: "Indie Flower, cursive",
              fontSize: "18px",
            }}
          >
            {loading ? (
              <CircularProgress
                size="4rem"
                sx={{
                  color: "black",
                  margin: "auto",
                  alignContent: "center",
                }}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* typingdiv */}
            {!selectedChat.isGroupChat &&
              (isTyping ? (
                <div>
                  <Lottie
                    width={100}
                    style={{ marginBottom: 10, marginLeft: 0 }}
                    options={defaultOptions}
                  />
                </div>
              ) : (
                <></>
              ))}
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                sx={{
                  margin: "0 5px 5px 5px",
                  border: "1px solid black",
                  borderRadius: "5px",
                  width: "95%",
                  fontFamily: "Indie Flower, cursive",
                }}
                onKeyDown={sendMessage}
                onChange={TypingHandler}
                value={newMessage}
              ></TextField>
              <MicIcon width={3} onClick={GetVoiceTyped} />
            </div>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            fontSize: "30px",
            margin: "auto auto",
          }}
        >
          Click on a user to start chatting.
        </Box>
      )}
    </>
  );
};

export default SingleChat;
