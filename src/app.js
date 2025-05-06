const express = require('express');
const { adminAuth } = require('./middlewares/auth');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json())
app.post("/signup", async (req, res) => {
    console.log(req.body);
    // const user = new User({
    //     firstName: 'Akash',
    //     lastName: 'Tiwari',
    //     emailId: 'abc@abc.com',
    //     password: 'abc123',
    //     age: 33,
    //     gender:'male'
    // });
    const user = new User(req.body);
    // creating a new instance of the  user model
    try {
        await user.save();
        res.send("User added successfully");

    } catch (error) {
        res.status(400).send("Error saving the user")
    }
});


// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    console.log(userEmail)

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
})

connectDB().then(() => {
    console.log("database connection done successfully");
    app.listen(3000, () => {
        console.log("server is successfully listening on 3000")
    });
}).catch((err) => {
    console.error("Database cannotbe connected");
})


