const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');



requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const { toUserId, status } = req.params;
        const allowedStatus = ['interested', 'ignored'];

        const isAllowedStatus = allowedStatus.includes(status);


        if (!isAllowedStatus) {
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }



        const toUser = await User.findOne({ _id: toUserId });

        if (!toUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // If there is an exising connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists"
            })
        }

        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const connectionRequestData = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data: connectionRequestData
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];

        const isAllowedStatus = allowedStatus.includes(status);
        if (!isAllowedStatus) {
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }
        console.log(loggedInUser.id)
        const existingConnectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if (!existingConnectionRequest) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        existingConnectionRequest.status = status;
        
        const data = await existingConnectionRequest.save();

        res.json({
            message:"Connection request " + status,
            data
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});
module.exports = requestRouter;