const express = require('express');
const { adminAuth } = require('./middlewares/auth');
const connectDB = require('./config/database');

const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');

app.use(express.json())
app.post("/signup", async (req, res) => {
    try {
        // Validation of data
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
        // console.log(error)
        res.status(400).send("ERROR: " + error.message);
    }
});

app.post("/login", async (req, res) =>{
    try {
       const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
                throw new Error("Email is not valid");
        }
    const user = await User.findOne({emailId: emailId});
        if(!user){
                throw new Error("Invalid Credentials");
        }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){
        res.send("Login Successfull !!");
    } else {
        throw new Error("Invalid Credentials");
    }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
        
    }
})
// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.findOne({ emailId: userEmail })
        if (users.length === 0) {
            res.status(404).send("No user found with the searched email id");
        } else {
            res.send(users);

        }


    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})
// get user by id

app.get("/userId", async (req, res) => {
    const id = req.body.id;

    try {
        const users = await User.findById(id);
        if (users.length === 0) {
            res.status(404).send("No user found with the searched email id");
        } else {
            res.send(users);

        }


    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})
// Feed API  -> Get / Feed - get all the users from the database

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("No user found with the searched email id");
        } else {
            res.send(users);

        }
    } catch (error) {
        res.status(400).send("Something went wrong");

    }
});

// Delete user
app.delete("/user", async (req, res) => {
    const id = req.body.id;
    try {
        const user = await User.findByIdAndDelete(id);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

//  Update data of the user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;


    try {
        const ALLOWED_UPDATES = [
            "photourl", "gender", "about", "age", "skills", "id"
        ];

        const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed");
        }
        if (data.skills?.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const returnUser = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        res.send("User updted successfully")
    } catch (error) {
        res.status(400).send("Update failed:" + error.message);
    }
})

// update the user by email id

app.put("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body;
    console.log(data)
    try {
        const returnUser = await User.findOneAndUpdate({ emailId }, data);
        // const returnUser = await User.findOne({emailId});
        console.log(returnUser);
        res.send("User updted successfully");
    } catch (error) {
        console.log(error)
        res.status(400).send("Something went wrong");
    }
});

connectDB().then(() => {
    console.log("database connection done successfully");
    app.listen(3000, () => {
        console.log("server is successfully listening on 3000")
    });
}).catch((err) => {
    console.error("Database cannotbe connected");
})


