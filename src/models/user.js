import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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
			minlength: 7,
		},
		contactNo: {
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

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("Invalid email or password");

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) throw new Error("Invalid email or password");

	return user;
};

userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password") || user.isModified("masterkey")) {
		user.password = await bcrypt.hash(user.password, salt);
		user.masterkey = await bcrypt.hash(user.masterkey, salt);
	}

	next();
});

export const User = mongoose.model("User", userSchema);
