const { DataTypes } = require('sequelize');
const db = require('../db');

const Route = db.define('route', {
    routeName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    routeType: {
       type: DataTypes.STRING,
       allowNull: false
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keywords: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
});

module.exports = Route