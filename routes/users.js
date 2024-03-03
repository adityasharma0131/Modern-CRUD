const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb+srv://adityasharma0431:anant99@cluster0.oxqkdpp.mongodb.net/");


connect.then(() =>{
    console.log("Database Connected Successfully!!");
})
.catch(() =>{
    console.log("Error Connecting Database!");
});


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        require: true,
        default: Date.now
    }
});

const collection = new mongoose.model("entries", LoginSchema);

module.exports = collection;