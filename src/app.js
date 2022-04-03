import express from "express";
import helmet from "helmet";
import "./db/mongoose.js";
import router from "./routes/user.js";
import cors from "cors";
import compression from "compression";

const port = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(router);
// uncaught errors catch here
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    result: 0,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server Started on: http://localhost:${port}`);
});
