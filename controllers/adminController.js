const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { User } = require("../models");

//TODO Admin Routes (Create Routes, Delete Routes, Get Route List, Update Password )
const adminController = Router();

module.exports = adminController;