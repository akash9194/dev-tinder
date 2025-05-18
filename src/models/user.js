const mongoose = require('mongoose');

const {Schema} = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user.id }, "DevTinder@2025", {expiresIn: '7d'});
    return token;
};

userSchema.methods.validatePassowrd = async function (passwordInputByUser) {
    const user = this;
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashPassword);
    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);
module.exports = User;