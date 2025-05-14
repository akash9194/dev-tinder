const mongoose = require('mongoose');
const {Schema} = mongoose;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String
    },
    age:{
        type: Number,
        min: 18
    },
    gender: {
        type: String,
         validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photourl:{
        type: String,
        default: 'https://geographyandyou.com/images/user-profile.png'
    },
    about:{
        type: String,
        default:"This is default about of the user"
    },
    skills:{
        type: [String],
    },
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;