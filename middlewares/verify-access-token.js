const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        jwt.verify(authHeader, process.env.SERVER_SECRET, (error, user) => {
            if (error) {
                res.status(403).json({ errorMessage: "Access token is invalid" });
            }
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json({ errorMessage: "No access token provided" });
    }
};

module.exports = verifyAccessToken;