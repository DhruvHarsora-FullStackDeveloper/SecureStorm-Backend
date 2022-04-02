import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import router from "./routes/user.js";

mongoose.connect(process.env.MONGODB_URL, {});

const port = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(router);
// uncaught errors catch here
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({
		success: 0,
		message: err.message,
		status: err.status,
		stack: err.stack,
	});
});

app.listen(port, () => {
	console.log(`Server Started on: http://localhost:${port}`);
});
