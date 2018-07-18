const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var ChatSchema = new mongoose.Schema({
    "pengirim":{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users',
        required:true,
        trim:true
    },
    "kepada":{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Users',
        required:true,
        trim:true
    },
    "roomsecret":{
        type:String,
        required:true
    },
    "pesan":{
        type:String,
        require:true
    },
    "tanggal":{
        type:String,
        require:true
    }
});

var Chat = mongoose.model('Chats',ChatSchema);
module.exports = {Chat}