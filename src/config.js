// importing mongoose to export to db
const mongoose = require('mongoose');

// connect to db
const connect = mongoose.connect('mongodb+srv://wuyepkate:Password@cluster0.e3dbxct.mongodb.net/Readytoeat?retryWrites=true&w=majority&appName=Cluster0');

// check data base connection

connect.then(() => {
    console.log('Database successfully connected');
})
.catch(() => {
    console.log('Database connection failed');
})

//create a schema
const loginSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
});

// export as module
const collection = new mongoose.model('users', loginSchema);
module.exports = collection;