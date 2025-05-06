const mongoose = require('mongoose');

const connectDB =  async () =>{
    await mongoose.connect('mongodb+srv://namastedev:welcome123@namastenode.f1shygs.mongodb.net/devTinder');
}
module.exports = connectDB;


