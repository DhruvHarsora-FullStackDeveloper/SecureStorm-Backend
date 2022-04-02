import express from "express";
import helmet from "helmet";

const port = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

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
