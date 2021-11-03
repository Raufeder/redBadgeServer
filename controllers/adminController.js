const bcrypt = require("bcryptjs");
const { Router } = require("express");
const Route = require("../models/route");
const User = require("../models/user");

const adminController = Router();

adminController.put("/add/:id", function (req, res) {
  User.findOne({ where: { id: req.params.id } }).then(function (user) {
    if (user) {
      user.userType = "admin";
      user.update(user, { fields: ["userType"] }).then(() => {
        res.status(200).send(user);
      });
    } else {
      res.status(502).send({ error: "Couldn't make user an Admin" });
    }
  });
  // res.status(501).json({
  //   message: "Error Occured",
  // });
});

adminController.delete("/delete/:id", async (req, res) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    }).then((data) => {
      res.status(200).json({
        message: "user deleted",
      });
    });
  } catch (e) {
    res.status(500).json({
      message: "failed to delete user",
    });
  }
});

adminController.put("/changepassword/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    let user = await User.findOne({
      where: {
        id: userId,
      },
    });

    const password = req.body.user.password;

    if (user && password) {
      user.password = await bcrypt.hash(password, 12);
      user.save();
      res.status(200).json({
        message: "password changed successfully",
      });
    } else if (!password) {
      res.status(422).json({
        message: "missing new password",
      });
    } else {
      res.status(404).json({
        message: "Couldn't find user",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "request failed",
    });
  }
});

adminController.get("/userlist", async (req, res) => {
  try {
    const listofUsers = await User.findAll();
    res.status(200).json({
      users: listofUsers,
    });
  } catch (e) {
    res.status(500).json({
      message: "Couldn't get user list",
    });
  }
});

adminController.post("/add/route", function (req, res) {
  let routeName = req.body.route.routeName;
  let routeType = req.body.route.routeType;
  let grade = req.body.route.grade;
  let keywords = req.body.route.keywords;
  let description = req.body.route.description;
  let completed = req.body.route.completed;

  Route.create({
    routeName: routeName,
    routeType: routeType,
    grade: grade,
    keywords: keywords,
    description: description,
    completed: completed,
  }).then(
    function createSuccess(newRouteName) {
      res.json({
        messasge: "Route successfully made",
        routeName: routeName,
      });
    },
    function createError(err) {
      res.send(500, err.message);
    }
  );
});

adminController.delete("/delete/route/:id", async (req, res) => {
  try {
    let routeId = req.params.id;
    let deleteRoute = await Route.findOne({
      where: {
        id: routeId,
      },
    });

    if (deleteRoute) {
      deleteRoute.destroy();
      res.status(200).json({
        message: "route deleted",
      });
    } else {
      res.status(401).json({
        message: "Couldn't find route",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "failed to delete route",
    });
  }
});

adminController.put("/edit/route/:id", async (req, res) => {
  try {
    let routeName = req.body.route.routeName;
    let routeType = req.body.route.routeType;
    let grade = req.body.route.grade;
    let keywords = req.body.route.keywords;
    let description = req.body.route.description;
    let completed = req.body.route.completed;

    Route.update(
      {
        routeName: routeName,
        routeType: routeType,
        grade: grade,
        keywords: keywords,
        description: description,
        completed: completed,
      },
      { where: { id: req.params.id } }
    ).then(
      res.status(200).json({
        message: "Route  Updated",
      })
    );
  } catch (e) {
    res.status(500).json({
      message: "Couldn't update route",
    });
  }
});

module.exports = adminController;
