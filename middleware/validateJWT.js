const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ValidateJWTMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  } else if (req.headers.authorization) {
    const { authorization } = req.headers.authorization;
    // res.status(400).json({
    //   message: "at least we got here"
    // })
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

      
      if (token) {
        User.findOne({
          where: {
            id: decoded.id
          }
        })
        .then(user => {
          req.user = user;
          next();
        })
      } else {
        res.status(401).json({
          message: 'Not allowed'
        });
      }
    });
  } else {
    res.status(401).json({
      message: 'whoops'
    });
  }
}

module.exports = ValidateJWTMiddleware;