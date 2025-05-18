const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async (req, res, next) => {
    try {
        // Read the token from the request
        const { token } = req?.cookies;

        if (!token) {
            throw new Error("Token is not valid !!!!");

        }
        // validate the token
        const decodedObject = await jwt.verify(token, "DevTinder@2025");

        const { _id } = decodedObject;
        // find the user 

        const user = await User.findById({ _id });

        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }


}
module.exports = {
    userAuth
}