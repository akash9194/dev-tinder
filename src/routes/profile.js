const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateEditProfileData} = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const { user } = req;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Reuqest");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} !!! Your profile updated Successfully`,
            data: loggedInUser
        })
        // res.send(`${loggedInUser.firstName} !!! Your profile updated Successfully`);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
        
    }
});

module.exports = profileRouter;