const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {mongoose} = require('./config/mongoose');
var socketioJwt   = require("socketio-jwt");

const port = process.env.PORT || 3000;
var jwt = require('jsonwebtoken');



//var tokennya = jwt.sign({ username: 'fadli' }, rahasiaJWT, { expiresIn: '1h' });

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();

});


var route = require('./route')(app);

/*
io.use(socketioJwt.authorize({
    secret: rahasia,
    handshake: true
}));

io.on('connection',(socket)=>{
    console.log('hello! ', socket.decoded_token.username);
    
});*/



server.listen(port,()=>{
    console.log(`Start pada port : ${port}`);
});