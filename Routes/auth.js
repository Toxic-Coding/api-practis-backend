const express = require("express");
/* Creating a router object. */
const router = express.Router();
/* Importing the user model from the models folder. */
const User = require("../models/user");
/* Importing the body and validationResult from express-validator. */
const { body, validationResult } = require("express-validator");

/* A library that is used to hash passwords. */
const bcrypt = require("bcryptjs");

/* Used to create a token for the user. */
const jwt = require("jsonwebtoken");

/* A secret key that is used to create a token. */
const JWT_SECRET = "adilisagood$$&&boy";

/* Importing the fetchusers middleware. */
var fetchusers = require("../middleware/fetchusers");

/* This is a route that is used to signup the user. */
router.post(
  "/signup",
  /* Validating the input. */
  [
    body("name").isString(),
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    /* This is checking if there are any errors in the input. */
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      /* This is checking if the user already exists in the database. */
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      /* Generating a salt for the password. */
      let salt = await bcrypt.genSaltSync(10);
      /* Hashing the password. */
      let secpass = await bcrypt.hash(req.body.password, salt);
      /* Creating a new user. */

      /* Creating a new user in the database. */
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
        image: "",
      });

      /* Creating a payload for the token. */
      const data = {
        user: {
          id: user.id,
        },
      };
      /* Creating a token for the user. */
      let authtoken = jwt.sign(data, JWT_SECRET);
      req.session.token = authtoken;
      req.session.cookie.expires = new Date(Date.now() + 60000);
      req.session.cookie.maxAge = 60000;
      res.json({ authtoken: authtoken, session: req.session });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

/* This is a route that is used to login the user. */
router.post(async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }

    let configpass = await bcrypt.compare(password, user.password);
    if (!configpass) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }

    console.log(user);

    req.session.user = user;
    // console.log(req.session);
    res.status(200).json({ message: "login success", session: req.session });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

/* This is a route that is used to get the user profile. */
router.get("/profile", fetchusers, async (req, res) => {
  try {
    let user = await User.findById(req.session.user._id).select("-password");
    if (!user) {
      res.status(401).json({ error: "Authenticate using a valid token!" });
    }
    res.status(200).json({ email: user.email });
    //  let user = await User.findById()
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

/* This is a route that is used to get all the users from the database. */
router.get("/getusers", async (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      console.log("somthing realy wrong");
    } else {
      res.send(users);
    }
  });
});

router.get("/search/:name", (req, res) => {
  try {
    let regx = new RegExp(req.params.name, "i");
    User.find({ name: regx }).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/getme", (req, res) => {
  res.send(`<h1>hello im working.</h1>`);
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.send({ message: "logout successfully" });
});
module.exports = router;
