const express = require("express");
const gravatar = require("gravatar"); //https://github.com/emerleite/node-gravatar
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Input Validation
const register = require("../../validation/register");
const login = require("../../validation/login");

const keys = require("../../config/keys");
const User = require("../../models/User");

// @route:        GET api/users/test
// @description:  Test users routing
// @access:       Public
router.get("/test", (req, res) => res.send("users worked"));

// @route:        POST api/users/register
// @description:  Register user
// @access:       Public
router.post("/register", (req, res) => {
  // check validation
  const { errors, isValid } = register(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // user already exists
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // default
      });

      // create new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      // hash password with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          // save to mongoDB
          newUser
            .save()
            .then(user => res.json({ user }))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route:        POST api/users/login
// @description:  Login user / returning Json web token
// @access:       Public
router.post("/login", (req, res) => {
  // check validation
  const { errors, isValid } = login(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check email found or not
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      // not found email
      errors.emailNotFound = "User not found";
      return res.status(404).json(errors);
    }

    //check password using bcrypt
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // user Matched

        // create a JWT payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: "Login success",
              token: "Bearer " + token
            });
          }
        ); // token exist in 1 hour
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route:        GET api/users/current

// @description:  Return current userr
// @access:       Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
