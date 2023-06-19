const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
var ip = require('ip');


http.listen(3000, () => {
    console.log("server is running on 3000");
})


mongoose.connect('mongodb://127.0.0.1:27017/chat_socket_io', (err) => {      //connection
    if (err) {
        console.log("error in model ==========>", err);
    }
    else {
        console.log("mongoose connection successfully");
    }
});

var chat_schema = new mongoose.Schema({                  //schema
    nick_name: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const chat_model = mongoose.model('Chat', chat_schema);






app.use(express.static(__dirname + '/public'));    // html file in express

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})


//socket
const io = require('socket.io')(http)

io.on('connect', function (socket) {
    console.log('connected...');
    const data = ip.address();
    console.log("🚀 ~ User IP address:->", data)

    socket.on('new_user_joined', (nm) => {                     // new user join event 
        console.log('new user join ==>', nm);
        // msg = nm;
        socket.broadcast.emit('user_joined', nm);
    })

    socket.on('message', (msg) => {

        var new_msg = new chat_model(msg)
        new_msg.save((err) => {
            if (err) {
                console.log("error==========>", err);
            }
        })

        socket.broadcast.emit('message', msg);    // broadcast = all connected socket send messages


    })
    socket.on('disconnect', (nm) => {
        console.log('disconnected...', nm);
        // socket.broadcast.emit('disconnect');
    })

})
