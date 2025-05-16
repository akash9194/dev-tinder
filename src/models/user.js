const mongoose = require('mongoose');

const {Schema} = mongoose;
const validator = require('validator');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                   throw new Error("Email is not valid:" + value);
            }
        }
    },
    password:{
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
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
        default: 'https://geographyandyou.com/images/user-profile.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL");
            }
        }   
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