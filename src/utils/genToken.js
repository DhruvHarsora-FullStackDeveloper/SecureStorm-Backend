import jwt from "jsonwebtoken";
export const generateAuthToken = function (user) {
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	return token;
};
