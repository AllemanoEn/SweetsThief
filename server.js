//
// server
//

// DEBUG
var debug = true;


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));


var users = [];

io.on('connection', function(socket)
{
    socket.on('chat_message', function(pseudo, message, color)
    {
        io.emit('chat_message', pseudo, message, color);
        if (debug)
        {
            console.log("[CHAT MSG] " + pseudo + ": " + message);
        }
    });

    socket.on('getall_users', function()
    {
        io.emit('getall_users', users);
        if (debug)
        {
            console.log("[GETALL USERS] " + users);
        }
    });

    socket.on('send_user', function(user)
    {
        users.push(user);
        if (debug)
        {
            console.log("[SEND USER] " + user);
        }
    });

    socket.on('disconnect', function()
    {
        users = [];
        socket.broadcast.emit('send_user');
    });
});

http.listen(8080, function()
{
    console.log('Listening on port 8080');
});
