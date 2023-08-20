const GetSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const GetFullSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

const isSameSender = (messages, m, i, userId) => {
  // console.log("isSameSender working");
  return (
    true &&
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    true &&
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    (i < messages.length - 1 &&
      // messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return "0";
  else if (
    i < messages.lenght - 1 &&
    // messages[i + 1].sender._id !== m.sender._id &&
    messages[i].sender._id === userId
  )
    return "40%";
  else return "auto";
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export {
  GetSender,
  GetFullSender,
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
};
