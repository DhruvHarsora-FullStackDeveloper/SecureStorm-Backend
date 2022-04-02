import express from "express"
import { sendWelcomeEmail, sendCancelationEmail, sendOTPEmail } from "./email/sendEmail.js";

const app = express();
app.set("views", "ejs")
app.get("/", (req, res) => {
  res.send("home page");
});
app.use(express.json());
app.post("/user", (req, res) => {
  sendOTPEmail(req.body.email, req.body.name, req.body.otp);
  res.send(req.body);
});
const port = process.env.PORT || 7000;
app.listen(port, (req, res) => {
  console.log(`server listening on port ${port}`);
});
