const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("please fill all the details!");
    return res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    msgContent: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name email dp");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name dp email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    // console.log(message);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email dp")
      .populate("chat");
    res.json(messages);
    // console.log("MESSAGES: ");
    // console.log(messages);
  } catch (error) {
    return res.status(400).json(error);
  }
});
module.exports = { sendMessage, allMessages };
