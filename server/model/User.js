const mongoose = require('mongoose');
const validator = require('validator');


var UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
});

var User = mongoose.model('Users',UserSchema);

module.exports = {User};