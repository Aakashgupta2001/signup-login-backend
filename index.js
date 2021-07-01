const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//adding the routes
const authRoute = require("./routes/auth");
const privateRoute = require("./routes/privateRoutes");

//configuring environment variable
dotenv.config();

//connecting mongoose
mongoose.connect(
  process.env.DB_CALL,
  { useNewUrlParser: true, useUnifiedTopology: true },

  (err) => {
    if (err) throw err;
    console.log("connected to db");
  }
);

//middlewares ( for post request to send json )
app.use(express.json());

//using routes middlewares
app.use("/api/", authRoute);
app.use("/api/private", privateRoute);

port = 5000;
app.listen(port, () => {
  console.log("app is running at port " + port);
});
