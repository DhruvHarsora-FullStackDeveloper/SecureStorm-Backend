import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(process.env.SALT_VALUE);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
      minlength: 6,
    },
    contact: {
      type: Number,
      require: true,
      minlength: 10,
    },
    masterkey: {
      type: String,
      require: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isModified("masterkey")) {
    user.password = await bcrypt.hash(user.password, salt);
    user.masterkey = await bcrypt.hash(user.masterkey, salt);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.masterkey;
  return userObj;
};

export const User = mongoose.model("User", userSchema);
