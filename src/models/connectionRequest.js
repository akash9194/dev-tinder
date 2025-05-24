const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // refrence to the user collection
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // refrence to the user collection
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: props => `${props.value} is an incorrect status type`
        },
        required: true,
    },
},
    {
        timestamps: true
    });

connectionRequestSchema.pre("save",  function(next){
    const connectionRequest = this;
    // Chceck if fromUser and toUser id are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error ("You cannot send connection request to yourself !!");
    }
    next();
});

const ConnectionRequestModel =  new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;