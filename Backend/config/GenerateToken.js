const jwt = require("jsonwebtoken");

const GenerateToken = (id) => {
  return jwt.sign(
    {
      data: id,
    },
    process.env.SECRET,
    {
      expiresIn: "60d",
    }
  );
};

module.exports = GenerateToken;
