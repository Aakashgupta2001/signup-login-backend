const routes = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//importing validation for verifying input
const { registerValidation, loginValidation } = require("../validation");

//post request for adding new user(registering user)
routes.post("/register", async (req, res) => {
  //validation the data before submitting
  const { error } = registerValidation(req.body);

  //validating the data according to the structure
  if (error) {
    return res.status(401).send(error.details[0].message);
  }
  //checking if the email already exists
  emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(401).send("Email Already exists");

  //checking if username already exists
  usernameExist = await User.findOne({ name: req.body.name });
  if (usernameExist) return res.status(401).send("username Already exists");

  //encrypting the passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //adding new user in the database
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUsr = await user.save();
    res.send("added to db successfully ");
  } catch {
    res.status(400).send("error in adding data to the database");
  }
});

routes.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email does not exist");

  const passCheck = await bcrypt.compare(req.body.password, user.password);
  if (!passCheck) return res.status(400).send("wrong pass");

  //creating login token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = routes;
