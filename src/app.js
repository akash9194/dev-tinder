const express = require('express');

const app = express();

// request handler


app.use('/hello/2', (req, res) =>{
    res.send("22 Hello hello hello!!!")
});
app.use('/hello', (req, res) =>{
    res.send("Hello hello hello!!!")
});
app.use('/test',(req, res) =>{
    res.send("Hello test form the server !!!")
});
app.get('/user',(req, res) =>{
    res.send({firstName:"akash", lastName: "tiwari"})
});
app.post('/user',(req, res) =>{
    console.log("save data to the database")
    res.send({firstName:"akash", lastName: "tiwari"} + " added")
});
app.use('/', (req, res) =>{
    res.send("Namaskar!!!")
});
app.listen(3000, ()=>{
    console.log("server is successfully listening on 3000")
});