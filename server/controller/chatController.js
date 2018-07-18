const {Chat} = require('../model/Chat');
const _ = require('lodash');
const CryptoJS = require('crypto-js');
const {rahasiaJWT,passwordSecret} = require('../config/secret');
const jwt = require('jsonwebtoken');


var create = (req,res)=>{
    if(req.body.username === '' || req.body.username === undefined){
        return res.send({
            "condition":0,
            "message":"Users validation failed: username: Path `username` is required."
        });
    }
    if(req.body.password ===""|| req.body.password===undefined){
        return res.send({
            "condition": 0,
            "message": "Users validation failed: password: Path `password` is required."
        });
    }

    var data = {
        username : req.body.username,
        password : CryptoJS.AES.encrypt(req.body.password,passwordSecret).toString()
    }
    var data = _.pick(data,['username','password']);
    var user = new User(data);
    
    user.save().then((user)=>{
        res.send({
            id:user._id,
            username:user.username
        });
    }).catch((e)=>{
        res.send({
            condition:0,
            message:e.message
        });
    });
}

var login = (req,res)=>{
    if(req.body.username === '' || req.body.username === undefined){
        return res.send({
            "condition":0,
            "message":"Users validation failed: username: Path `username` is required."
        });
    }
    if(req.body.password ===""|| req.body.password===undefined){
        return res.send({
            "condition": 0,
            "message": "Users validation failed: password: Path `password` is required."
        });
    }
    if(req.body.username != null && req.body.password != null){
        User.findOne({'username':req.body.username},(err,data)=>{
            if(err) return res.send(err);

            if(data==null){
                return res.status(401).send({
                    message:'wrong password or username',
                    condition:0
                });
            }

            var decr = CryptoJS.AES.decrypt(data.password,passwordSecret).toString(CryptoJS.enc.Utf8);
            if(req.body.password === decr){
               
                res.send({
                    id:data.id,
                    username:data.username,
                    token: jwt.sign({ username: 'fadli' }, rahasiaJWT, { expiresIn: '1h' }),
                    condition:1
                })
            }else{
                res.status(401).send({
                    message:'wrong password or username',
                    condition:0
                });
            }

        });
    }
}

var index = (req,res)=>{
    User.find().then((users)=>{
        if(!users){
            return res.send({condition:0});
        }
        return res.send(users);
    })
}

module.exports = {
    create,
    login,
    index
}

