const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        //required: 'This field is required.'
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phoneno: {
        type: String
    },
    // gendermale: {
    //     type: String
    // },
    // genderfemale: {
    //     type: String
    // },
    age: {
        type: String
    },
    addr: {
        type: String
    },
    password: {
        type: String
    },
    cpassword: {
        type: String
    }
});

mongoose.model('User', userSchema);