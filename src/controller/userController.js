import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateAuthToken } from "../utils/genToken.js";
import msg from "../common/messages.js";

const userSignUp = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      contact: req.body.contact,
      masterkey: req.body.masterkey,
    });

    if (user.password.length < 8 || user.password.length > 12) {
      return res
        .status(msg.BAD_REQ_CODE)
        .send({ result: 0, error: "Password length must be between 8 to 12" });
    }

    if (user.masterkey.length < 8 || user.masterkey.length > 18) {
      return res
        .status(msg.BAD_REQ_CODE)
        .send({ result: 0, error: "Masterkey length must be between 8 to 18" });
    }
    const tempuser = await User.findOne({ email: req.body.email });
    if (tempuser) {
      return res
        .status(msg.BAD_REQ_CODE)
        .send({ result: 0, error: msg.EMAIL_ALREADY_EXIST });
    }
    await user.save();
    const token = generateAuthToken(user);
    res.status(msg.CREATED_CODE).json({ result: 1, user, token });
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(msg.NOT_FOUND_CODE)
        .send({ result: 0, error: msg.USER_NOT_FOUND });
    } else {
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid) {
        return res
          .status(msg.BAD_REQ_CODE)
          .send({ result: 0, error: msg.INCORRECT_PASSWORD });
      }
      const token = generateAuthToken(user);
      res.status(msg.OK_CODE).send({ result: 1, user, token });
    }
  } catch (err) {
    next(err);
  }
};

const userUpdate = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(msg.NOT_FOUND_CODE).send({
        result: 0,
        error: msg.USER_NOT_FOUND,
      });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "contact"];
    const isValidUpdates = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    // check if only allowed fields are updated
    if (!isValidUpdates) {
      return res
        .status(msg.BAD_REQ_CODE)
        .send({ result: 0, error: msg.INVALID_UPDATES });
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    return res.status(msg.OK_CODE).send({ result: 1, user });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateMasterKey = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(msg.NOT_FOUND_CODE).send({
        result: 0,
        error: msg.USER_NOT_FOUND,
      });
    }
    const masterkey = req.body.masterkey;
    user.masterkey = masterkey;
    await user.save();
    res.status(msg.OK_CODE).send({ result: 1, user });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(msg.NOT_FOUND_CODE).send({
        result: 0,
        error: msg.USER_NOT_FOUND,
      });
    }
    const password = req.body.password;
    user.password = password;
    await user.save();
    res.status(msg.OK_CODE).send({ result: 1, user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(msg.NOT_FOUND_CODE).send({
        result: 0,
        error: msg.USER_NOT_FOUND,
      });
    }
    await User.deleteOne({ _id: id });
    res.status(msg.OK_CODE).json({ result: 1, message: "user deleted" });
  } catch (err) {
    next(err);
  }
};

export {
  userSignUp,
  userLogin,
  userUpdate,
  updateMasterKey,
  updatePassword,
  deleteUser,
};
