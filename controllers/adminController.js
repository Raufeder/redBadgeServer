const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { Route } = require("../models/route");
const { User } = require("../models/user");
const validateSession = require("../middleware/validateJWT");

const adminController = Router();

adminController.put('/add/:id', validateSession, async (req,res) => {
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

adminController.delete('/delete/:id', async (req,res) => {
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

adminController.put('/changepassword/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const password = req.body;

        let changePassword = await User.findOne({
            where: {
                id: userId
            }
        });

        if (changePassword && password) {
            changePassword.password = await bcrypt.hash(password, 12);
            changePassword.save();
            res.status(200).json({
                message: "password changed successfully"
            });
        } else if (!password) {
            res.status(422).json({
                message: "missing new password"
            });
        } else {
            res.status(404).json({
                message: "Couldn't find user"
            });
        }
    } catch (e) {
        res.status(500).json ({
            message: "request failed"
        });
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

adminController.delete('/delete/route/:id', async (req,res) => {
    try{
       let routeId = req.params.id
       let deleteRoute = await Route.findOne({
           where: {
               id: routeId
           }
       });

       if (deleteRoute) {
           deleteRoute.destroy();
           res.status(200).json({
               message: 'route deleted'
           });
       } else {
           res.status(401).json({
               message: "Couldn't find route"
           })
       }
    } catch (e) {
        res.status(500).json({
            message: 'failed to delete route'
        })
    }
});

adminController.get('/routelist', async (req, res) => {
    try {
        const listofRoutes = await Route.findAll();
        res.status(200).json({
            routes: listofRoutes
        });
    } catch (e) {
        res.status(500).json({
            message: "Couldn't get route list"
        })
    }
});

adminController.put('/edit/route/:id', function(req, res){
    let route_id = req.user.id;
    let routeName = req.body.route.routeName;
    let routeType = req.body.route.routeType;
    let grade = req.body.route.grade;
    let keywords = req.body.route.keywords;
    let description = req.body.route.description;
    let completed = req.body.route.completed;

    Route.update({
        route_id: route_id,
        routeName: routeName,
        routeType: routeType,
        grade: grade,
        keywords: keywords,
        description: description,
        completed: completed
    },
    {where: {id: request.params.id}}
    ).then(
        function updateSuccess(updatedChar) {
            response.json({
                route_id: route_id,
                routeName: routeName,
                routeType: routeType,
                grade: grade,
                keywords: keywords,
                description: description,
                completed: completed
            });
        },
        function createError(err) {             
            response.send(500, err.message);
            message: "Failed to update route"
        }
    )
});



module.exports = adminController;