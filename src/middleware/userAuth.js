import jwt from "jsonwebtoken";
import msg from "../common/messages.js";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
	try {
		if (!req.headers["authorization"]) {
			return res.status(msg.UNAUTHORIZED_CODE).send(msg.AUTH_ERR);
		}
		const token = req.headers["authorization"].replace("Bearer ", "");
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decode._id });
		if (!user) {
			return res.status(msg.NOT_FOUND_CODE).send(msg.USER_NOT_FOUND);
		}
		req.user = user;
		next();
	} catch (e) {
		next(e);
	}
};
