const express = require("express");

const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = ["firstName", "lastName", "skills", "age", "gender", "photourl", "about"]
// Get all the connection request for the loggedIn User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted", },
                { toUserId: loggedInUser._id, status: "accepted", },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if(loggedInUser?._id?.toString() === row?.fromUserId?._id?.toString()){
                return row.toUserId;
            } 
                return row.fromUserId;
            
        });
        res.json({
            data,
            message: "Data fetched successfully",
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);

    }
});
module.exports = userRouter;