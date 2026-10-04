const jwt = require('jsonwebtoken');
const User = require("../models/user");

const isUserAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Token not valid!');
        } else {
            const decodeToken = await jwt.verify(token, "MatchYourPatner@121");
            const userData = decodeToken?._id ? await User.findById(decodeToken?._id) : null;
            if (!userData) {
                throw new Error('User not found!');
            } else {
                req.user = userData;
                next();
            }
        }
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
}

module.exports = {
    isUserAuthenticate
}