const { Router } = require("express");
const { Route } = require("../models");

const routeController = Router();

routeController.get('/', async (req, res) => {
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

routeController.get('/routetype/:routeType', async (req, res) => {
    try {
        const routesByType = await Route.findAll({
            where: {
                routeType: req.params.routeType
            }
        });
        res.status(200).json({
            routesByType: routesByType
        })
    } catch (e) {
        res.status(500).json({
            message: "Couldn't get route list"
        })
    }
});

routeController.get('/grade/:grade', async (req, res) => {
    try {
        const routesByGrade = await Route.findAll({
            where: {
                grade: req.params.grade
            }
        });
        res.status(200).json({
            routesByGrade: routesByGrade
        })
    } catch (e) {
        res.status(500).json({
            message: "Couldn't get route list"
        })
    }
});



module.exports = routeController;