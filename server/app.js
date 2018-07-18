const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {mongoose} = require('./config/mongoose');
const {rahasiaJWT,roomSecret} = require('./config/secret');
var socketioJwt   = require("socketio-jwt");
const md5 = require('md5');
const moment = require('moment');

const port = process.env.PORT || 3000;
var jwt = require('jsonwebtoken');



//var tokennya = jwt.sign({ username: 'fadli' }, rahasiaJWT, { expiresIn: '1h' });

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');

    next();

});


var route = require('./route')(app);

const {Chat} = require('./model/Chat');
io.use(socketioJwt.authorize({
    secret: rahasiaJWT,
    handshake: true
}));

io.on('connection',(socket)=>{
    console.log('hello! ', socket.decoded_token.username);
    var roomNo = '';
    socket.on('join',(data)=>{
        Chat.find({
            $or:[
                {
                    $and:[
                        {kepada:data.kepada},
                        {pengirim:socket.decoded_token.id}
                    ]
                },{
                    $and:[
                        {kepada:socket.decoded_token.id},
                        {pengirim:data.kepada}
                    ]
                }
            ]
        }).exec((error,data)=>{
            
            if(data==0){
                roomNo = md5(`${socket.decoded_token.username}-${moment().valueOf()}-${roomSecret}`);
            }else{
                roomNo = data[0].roomsecret;
            }
            socket.emit('loadPesanLama',{data});
        });

        socket.join(roomNo);
        socket.broadcast.to(roomNo).emit('Selamat Datang',{pesan:'teman ada sedang online'});
        console.log('[2]-->'+roomNo);

    });


    socket.on('buatPesan',(data)=>{
        
        var chat = new Chat({
            pengirim:socket.decoded_token.id,
            kepada:data.kepada,
            roomsecret:roomNo,
            pesan:data.pesan,
            tanggal:moment().valueOf()
        });
        chat.save();
        console.log('[1]-->' + roomNo);
        socket.broadcast.to(roomNo).emit('updatePesan',{data});
        socket.emit('updatePesan',{data});
        
    });
});



server.listen(port,()=>{
    console.log(`Start pada port : ${port}`);
});
