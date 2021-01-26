require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//mt routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const usersRoutes = require("./routes/Users");
//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => console.log("DB Got Error"));

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// my Routes

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", usersRoutes);

//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
