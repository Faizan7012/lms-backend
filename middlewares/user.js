
const jwt = require("jsonwebtoken");

require('dotenv').config();

// Middleware for authentication using JWT
const userAuth = (req, res, next) => {
    const token = req.headers.token;
    console.log(token)
    if (token) {
        try {
            // Verifying the token using the secret key 'name'
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.body.userId = decoded.userId;
            req.body.role = decoded.userRole
            next();
        } catch (error) {
            res.status(400).send({ "message": "Please Login To access" , status:false });
        }
    } else {
        res.status(400).send({ "message": "Please provid the token" ,status:false });
    }
};

module.exports = { userAuth };