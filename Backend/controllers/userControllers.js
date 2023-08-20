//installer express-async-handler so that it helps in handling the errors
// without writting the try catch block for each route handler.

const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const GenerateToken = require("../config/GenerateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dp } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error(`Please enter all the fields!`);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    dp,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: GenerateToken(user._id),
      dp: user.dp,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user!");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userLogin = await User.findOne({ email });

  if (userLogin && (await userLogin.matchPassword(password))) {
    // res.status(200).send("Successful login!");
    res.status(200).json({
      _id: userLogin._id,
      name: userLogin.name,
      email: userLogin.email,
      // password: userLogin.password,
      isAdmin: userLogin.isAdmin,
      dp: userLogin.dp,
      token: GenerateToken(userLogin._id),
    });
  } else if (!userLogin) {
    res.status(400);
    throw new Error("Sorry no user exists!");
  } else if (userLogin && !(await userLogin.matchPassword(password))) {
    res.status(400);
    throw new Error("Incorrect Password!");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  return res.status(200).send(users);
});

module.exports = { registerUser, authUser, allUsers };
