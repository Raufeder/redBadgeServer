const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    url_userimage: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = User;