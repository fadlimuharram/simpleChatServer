const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
var socketioJwt   = require("socketio-jwt");

const port = process.env.PORT || 3000;

var jwt = require('jsonwebtoken');

const rahasia = 'ini rahasia lohh';

var tokennya = jwt.sign({ username: 'fadli' }, rahasia, { expiresIn: '1h' });
console.log(tokennya);

io.use(socketioJwt.authorize({
    secret: rahasia,
    handshake: true
}));

io.on('connection',(socket)=>{
    console.log('hello! ', socket.decoded_token.username);
    
});



server.listen(port,()=>{
    console.log(`Start pada port : ${port}`);
});