// get middlware token

const jwt = require("jsonwebtoken");
const config = require('../config/config');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (token) {
            const descode = jwt.verify(token, config.secret_jwt);
            req.user = descode;

        } else {
            req.status(200).send({ seccess: false, msg: " a token is requered" });
        }
        return next();
    }
    catch (error) {
        res.status(400).send(error.message);
    }

}
module.exports = verifyToken;