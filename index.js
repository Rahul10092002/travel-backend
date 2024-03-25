const express = require("express");
const cors = require("cors");
const roomRouter = require("./routes/roomRouter");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
// import roomRouter from "../routes/roomRouter.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  next();
});

app.use(express.json({ limit: "10mb" }));
//middleware

app.use(bodyParser.json());

app.use("/room", roomRouter);
app.use("/user", userRouter);
// app.use("/", (req, res) => res.json({ message: "welcome" }));

const startServer = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_CONNECT_URL)
      .then(() => console.log("mongooDB connected"));
    app
      .listen(port, () => console.log(`Server is listening on port: ${port}`))
      .on("error", (e) => {
        console.log("Error happened: ", e.message);
      });
  } catch (error) {
    console.log(error);
  }
};

startServer();
