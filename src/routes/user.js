import bcrypt from "bcryptjs";
import express from "express";
import { User } from "../models/user.js";

const router = new express.Router();

router.post("/signup", async (req, res, next) => {
	try {
		const person = new User({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			contactNo: req.body.contactNo,
			masterkey: req.body.masterkey,
		});
		await person.save();
		res.status(200).json({ person });
	} catch (err) {
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			// console.log(user);
			return res.status(404).send({ error: "User nor found" });
		} else {
			const isValid = await bcrypt.compare(req.body.password, user.password);
			if (!isValid) {
				return res.status(401).send({ error: "Unauthorised" });
			}
			res.status(200).send(user);
		}
	} catch (error) {
		// res.status(401).json({ msg: "unauthorised" });
		next(error);
	}
});

router.patch("/update/:id", async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(404).send({ error: "User not found" });
		}
		const updates = Object.keys(req.body);
		const allowedUpdates = ["username", "email", "contactNo"];
		const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));
		// check if only allowed fields are updated
		if (!isValidUpdates) {
			return res.status(400).send({ error: "Invalid Updates..." });
		}
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		res.status(200).send(user);
	} catch (err) {
		next(err);
	}
});

router.patch("/updatemasterkey", async (req, res, next) => {
	try {
		const id = req.body.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(404).send({ error: "User not found" });
		}
		const master_key = req.body.masterKey;
		user.masterkey = master_key;
		await user.save();
		res.status(200).send(user);
	} catch (err) {
		next(err);
	}
});

router.patch("/updatepassword", async (req, res, next) => {
	try {
		const id = req.body.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(404).send({ error: "User not found" });
		}
		const password = req.body.password;
		user.password = password;
		await user.save();
		res.status(200).send(user);
	} catch (err) {
		next(err);
	}
});

router.delete("/delete", async (req, res, next) => {
	try {
		const id = req.body.id;
		const user = await User.findById(id);
		if (!user) {
			res.status(404).send({ error: "User not found" });
		}
		await User.deleteOne({ _id: id });
		res.status(200).json({
			message: "deleted",
		});
	} catch (err) {
		next(err);
	}
});

export default router;
