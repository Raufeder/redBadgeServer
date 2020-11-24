const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { User } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');

const userController = Router();

userController.post('/register', function(req, res){
    let username = req.body.user.username;
    let password = req.body.user.password;

    User.create({
        username: username,
        passwordhash: bcrypt.hashSync(password, 12)
    }).then(
        function createSuccess(user) {
            var token = jwt.sign({id: user.id}, process.env.JWT_SECRET,
                {expiresIn: 60*60*24});

                res.json({
                    user: user,
                    message: 'User registered',
                    sessionToken: token
                });
        },
        function createError(err) {
            if (err instanceof UniqueConstraintError) {
                res.status(409).json({
                    message: 'Username already in use.'
                });
            } else {
                res.status(500).json({
                    message: 'Failed to register user'
                });
            }
        }
    ); 
});

module.exports = userController;