const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
  // console.log(req.user._id);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400);
  } else {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name dp email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        // console.log("chatData: ");
        // console.log(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        // console.log("FULL CHAT:");
        // console.log(fullChat);
        res.status(200).json(fullChat);
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name dp email",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please enter all the fields" });
  }

  var groupChatUsers = JSON.parse(req.body.users);
  // console.log("groupChatUsers");
  // console.log(groupChatUsers);

  if (groupChatUsers.length < 2) {
    return res
      .status(400)
      .send({ message: "Users should be more than 1 in group chat!" });
  }

  groupChatUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: groupChatUsers,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // console.log("fullGroupChat:");
    // console.log(fullGroupChat);

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log("error in chatController:");
    console.log(error);
    res.status(400).send(error);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.newGroupName && !req.body.currentGroupId)
    return res.status(400).send("Enter the new Group Name");

  const updatedChat = await Chat.findByIdAndUpdate(
    req.body.currentGroupId,
    {
      chatName: req.body.newGroupName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("chat not found!");
  } else {
    res.status(200).json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  if (!req.body.groupId && !req.body.userId) {
    return res.status(400).send("Kindly enter all the required details!");
  }

  const removed = await Chat.findByIdAndUpdate(
    req.body.groupId,
    {
      $pull: { users: req.body.userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400);
    throw new Error(Error);
  } else {
    res.status(200).json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  if (!req.body.groupId && !req.body.userId) {
    return res.status(400).send("Please enter all the required details!");
  }

  const added = await Chat.findByIdAndUpdate(
    req.body.groupId,
    {
      $push: { users: req.body.userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error(Error);
  } else {
    res.status(200).json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroup,
  addToGroup,
};
