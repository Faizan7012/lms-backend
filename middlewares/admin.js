
const jwt = require("jsonwebtoken");

require('dotenv').config();

// Middleware for authentication using JWT
const adminAuth = (req, res, next) => {
    const token = req.headers.token;

    if (token) {
        try {
            // Verifying the token using the secret key 'name'
            const decoded = jwt.decode(token);
            if(decoded.userRole == 'admin'){

                req.body.userId = decoded.userId;
                req.body.role = decoded.userRole
                next();
            }
            else{
               res.status(401).send({ "message": "Unauthorize person" ,status:false });
            }
            
        } catch (error) {
            res.status(400).send({ "message": "Please Login To access" , status:false });
        }
    } else {
        res.status(400).send({ "message": "Please provid the token" ,status:false });
    }
};

module.exports = { adminAuth };