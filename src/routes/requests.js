const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');



requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) =>{
   try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['interested', 'ignored'];
    
        const isConnectionAllowed = allowedStatus.includes(status);

       
        if(!isConnectionAllowed){
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }

         if(fromUserId === toUserId){
            return res.status(400).json({
                message: ""
            })
        }

        const toUser = await User.findOne({_id:toUserId});

        if(!toUser){
            return res.status(404).json({
                message: "User not found"
            });
        }
        // If there is an exising connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId:toUserId ,toUserId:fromUserId },
            ]
        });

        if(existingConnectionRequest){
             return res.status(400).json({
                message: "Connection request already exists"
            })
        }

        const connectionRequest = new ConnectionRequest({fromUserId,toUserId, status });
        const connectionRequestData = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " +  toUser.firstName ,
            data: connectionRequestData
        });
   } catch (error) {
        res.status(400).send("ERROR: " + error.message);
   }
});
module.exports = requestRouter;