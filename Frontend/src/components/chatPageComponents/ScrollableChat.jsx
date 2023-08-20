import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Tooltip, Box } from "@mui/material";

export const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages ? (
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} arrow>
                <Avatar
                  alt={m.sender.name}
                  src={m.sender.dp}
                  sx={{ paddingRight: "auto" }}
                />
              </Tooltip>
            )}
            <span
              style={{
                background: `${m.sender._id === user._id ? "pink" : "white"}`,
                maxWidth: "75%",
                borderRadius: "10px",
                padding: "5px 15px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginBottom: isSameUser(messages, m, i) ? "11px" : "20px",
              }}
            >
              {m.chat.isGroupChat && (
                <div
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontFamily: "Indie Flower, cursive",
                    fontSize: "20px",
                  }}
                >
                  {m.sender.name}
                </div>
              )}

              {m.msgContent}
            </span>
          </div>
        ))
      ) : (
        <div>Nothing Available</div>
      )}
    </ScrollableFeed>
  );
};
