const adminRequest = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    } else {
        if (req.user.userType == "admin") {
            next();
        } else {    
            res.status(401).json({
                message : 'Admin Access Required'
            });
        }
    }
};

module.exports = adminRequest