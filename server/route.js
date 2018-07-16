const userController = require('./controller/userController');
const {rahasiaJWT} = require('./config/secret');
var jwt = require('jsonwebtoken');

verifyToken=(req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof(bearerHeader) !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken,rahasiaJWT,(err,authData)=>{
            if(err){
                console.log(err);
                res.sendStatus(403);
            }else{
                next();
            }
        });
        
    }else{
        res.sendStatus(403);
    }
}

module.exports = function(app){
    app.post('/register',userController.create);
    app.post('/login',userController.login);
    app.get('/users',verifyToken,userController.index);
}