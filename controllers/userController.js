const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Router = require("express");
const Route = require("../models/route");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const userController = Router();

userController.post("/register", function (req, res) {
  let username = req.body.user.username;
  let email = req.body.user.email;
  let password = req.body.user.password;

  User.create({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 12),
  }).then(
    function createSuccess(user) {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      res.json({
        user: user,
        message: "User registered",
        sessionToken: token,
      });
    },
    function createError(err) {
      if (err instanceof UniqueConstraintError) {
        res.status(409).json({
          message: "Username already in use.",
        });
      } else {
        res.status(500).json({
          message: "Failed to register user",
        });
      }
    }
  );
});

userController.post("/login", function (req, res) {
  User.findOne({ where: { username: req.body.user.username } }).then(
    function (user) {
      if (user) {
        bcrypt.compare(
          req.body.user.password,
          user.password,
          function (err, matches) {
            if (matches) {
              let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
              });
              res.json({
                user: user,
                message: "Successful Login!",
                sessionToken: token,
              });
            } else {
              res.status(502).send({ error: "Login failed" });
            }
          }
        );
      } else {
        res.status(500).send({ error: "failed to authenticate" });
      }
    },
    function (err) {
      res.status(501).send({ error: "Login failed" });
    }
  );
});

userController.get("/view/:username", function (req, res) {
  User.findOne({
    where: { username: req.params.username },
  }).then(
    function findOneSuccess(data) {
      res.json(data);
    },
    function findOneError(err) {
      res.send(500, err.message);
    }
  );
});

userController.get("/routelist", async (req, res) => {
  try {
    const listofRoutes = await Route.findAll();
    res.status(200).json({
      routes: listofRoutes,
    });
  } catch (e) {
    res.status(500).json({
      message: "Couldn't get route list from here",
    });
  }
});

userController.delete("/delete", function (req, res) {
  User.findOne({ where: { username: req.body.user.username } }).then(function (
    user
  ) {
    if (user) {
      bcrypt.compare(
        req.body.user.password,
        user.password,
        function (err, matches) {
          if (matches) {
            User.destroy({
              where: { username: req.body.user.username },
            }).then(
              function deleteAccountSuccess(data) {
                res.send("Your account has been deleted.");
              },
              function deleteLogError(err) {
                res.send(500, err.message);
              }
            );
          }
        }
      );
    }
  });
});

module.exports = userController;
