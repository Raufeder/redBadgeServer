const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { Route } = require("../models/route");
const { User } = require("../models/user");


const adminController = Router();

//TODO Admin Routes (Edit Routes, Delete Routes, Get Route List, Update Password (Maybe) )
adminController.put('/add/:id', async (req,res) => {
    try {
        let userId = req.params.id;

        let userToAdmin = await User.findOne({
            where: {
                id: userId
            },
        });

        if (userToAdmin.userType !== 'admin') {
            userToAdmin.userType = 'admin';
            userToAdmin.save();
        } else {
            res.status(409).json({
                message: 'User is already an Admin'
            });
        }

        res.status(200).json({
            message: "User successfully made an Admin"
        })
} catch (e) {
    res.status(500).json({
        message: "Failed to get users"
    })
}
});

adminController.delete('/users/delete/:id', async (req,res) => {
    try {
        let userId = req.params.id

        let deleteUser = await User.findOne({
            where: {
                id: userId
            }
        });

        if (deleteUser) {
            deleteUser.destroy();
            res.status(200).json({
                message: 'user deleted'
            });
        } else {
            res.status(401).json({
                message: "Couldn't find user"
            })
        }
    } catch (e) {
        res.status(500).json({
            message: 'failed to delete user'
        })
    }
});

adminController.get('/userlist', async (req, res) => {
    try {
        const listofUsers = await User.findAll();
        res.status(200).json({
            users: listofUsers
        });
    } catch (e) {
        res.status(500).json({
            message: "Couldn't get user list"
        })
    }
});

adminController.post('/add/route', function(req, res) {
    let route_id = req.user.id;
    let routeName = req.body.route.routeName;
    let routeType = req.body.route.routeType;
    let grade = req.body.route.grade;
    let keywords = req.body.route.keywords;
    let description = req.body.route.description;
    let completed = req.body.route.completed;

    Route.create({
        route_id: route_id,
        routeName: routeName,
        routeType: routeType,
        grade: grade,
        keywords: keywords,
        description: description,
        completed: completed
    }).then(
        function createSuccess(newRouteName) {
            res.json({
                routeName: routeName
            })
        },
        function createError(err) {
            res.send(500, err.message);
        }
    )
});

module.exports = adminController;