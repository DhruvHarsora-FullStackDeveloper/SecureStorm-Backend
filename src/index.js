import app from "./app.js";
const port = process.env.PORT;
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Started on: http://localhost:${port}`);
});
