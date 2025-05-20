const express = require("express");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the  user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfully");

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassowrd(password);
        if (isPasswordValid) {
            // Create a jwt token
            const token = await user.getJWT();
            res.cookie("token", token,  { expires: new Date(Date.now() + 8 * 3600 * 10000)});
            // Add the token to cookie and send the response back to the user
            res.send("Login Successfull !!");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
});

authRouter.post("/logout", async (req, res) => {
    // TODO
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("User logged out successfully");
});

module.exports = authRouter;