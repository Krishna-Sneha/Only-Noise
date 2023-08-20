const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// let a = Math.random() * 10;
// let b = Math.random() * 10;
// let randomNumber = Math.floor(a * b);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    dp: {
      type: String,
      // default: function () {
      //   const a = Math.random() * 10;
      //   const b = Math.random() * 10;
      //   const randomNumber = Math.floor(a * b);
      //   let defaultValue = `https://api.dicebear.com/5.x/adventurer/svg?seed=${randomNumber}`;
      //   console.log(defaultValue);
      //   return defaultValue;
      // },
      default:
        "https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enterredPassword) {
  return await bcrypt.compare(enterredPassword, this.password);
};

//middleware function
userSchema.pre("save", async function (next) {
  if (!this.isModified) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// name
// email
// pwd
// dp of user
