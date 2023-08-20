const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // eg of token: "Bearer fdjsfljs308470urflkdlkuew987rwuklrfu987e"
      //we need to get token by splitting it from bearer

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.decode(token, process.env.SECRET);

      const id = decoded.data;

      req.user = await User.findById(id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed!");
    }
  } else if (!token) {
    res.status(401);
    throw new Error("Not authorized, No token");
  }
});

module.exports = { protect };
