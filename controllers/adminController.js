const bcrypt = require('bcryptjs');
const { Router } = require('express');
const { User } = require("../models");

const adminController = Router();

module.exports = adminController;