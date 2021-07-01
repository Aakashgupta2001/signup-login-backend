const routes = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

routes.get("/", verify, async (req, res) => {
  try {
    const userinfo = await User.findOne({ _id: req.user });
    return res.send(userinfo);
  } catch (err) {
    return res.send("User Not Found");
  }
});

module.exports = routes;
