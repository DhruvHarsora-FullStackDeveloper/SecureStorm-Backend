import bcrypt from "bcryptjs";
import express from "express";
import { User } from "../models/user.js";
import { userAuth } from "../middleware/userAuth.js";
import { generateAuthToken } from "../utils/genToken.js";
import res_msg from "../common/messages.js";
const router = new express.Router();

router.post("/signup", async (req, res, next) => {
	try {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			contact: req.body.contact,
			masterkey: req.body.masterkey,
		});

		await user.save();
		const token = generateAuthToken(user);
		res.status(res_msg.OK_CODE).json({ result: 1, user, token });
	} catch (err) {
		res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: err.message });
		//next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(res_msg.NOT_FOUND_CODE)
				.send({ result: 0, error: res_msg.USER_NOT_FOUND });
		} else {
			const isValid = await bcrypt.compare(req.body.password, user.password);
			if (!isValid) {
				return res
					.status(res_msg.UNAUTHORIZED_CODE)
					.send({ result: 0, error: res_msg.AUTH_ERR });
			}
			const token = generateAuthToken(user);
			res.status(res_msg.OK_CODE).send({ result: 1, user, token });
		}
	} catch (error) {
		res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: error.message });
		//next(error);
	}
});

router.patch("/:id", userAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			return res.status(res_msg.NOT_FOUND_CODE).send({
				result: 0,
				error: res_msg.USER_NOT_FOUND,
			});
		}
		const updates = Object.keys(req.body);
		const allowedUpdates = ["username", "email", "contact"];
		const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));
		// check if only allowed fields are updated
		if (!isValidUpdates) {
			return res.status(res_msg.BAD_REQ_CODE).send({ result: 0, error: res_msg.AUTH_ERR });
		}
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		return res.status(res_msg.OK_CODE).send({ result: 1, user });
	} catch (err) {
		return res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: error.message });
	}
});

router.patch("/masterkey/:id", userAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(res_msg.NOT_FOUND_CODE).send({
				result: 0,
				error: res_msg.USER_NOT_FOUND,
			});
		}
		const masterkey = req.body.masterkey;
		user.masterkey = masterkey;
		await user.save();
		res.status(res_msg.OK_CODE).send({ result: 1, user });
	} catch (err) {
		res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: error.message });
	}
});

router.patch("/password", userAuth, async (req, res) => {
	try {
		const id = req.body.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(res_msg.NOT_FOUND_CODE).send({
				result: 0,
				error: res_msg.USER_NOT_FOUND,
			});
		}
		const password = req.body.password;
		user.password = password;
		await user.save();
		res.status(res_msg.OK_CODE).send({ result: 1, user });
	} catch (err) {
		res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: error.message });
	}
});

router.delete("/:id", userAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(res_msg.NOT_FOUND_CODE).send({
				result: 0,
				error: res_msg.USER_NOT_FOUND,
			});
		}
		await User.deleteOne({ _id: id });
		res.status(res_msg.OK_CODE).json({ result: 1, message: "user deleted" });
	} catch (err) {
		res.status(res_msg.INTERNAL_SERVER_ERROR).json({ result: 0, msg: error.message });
	}
});

export default router;
