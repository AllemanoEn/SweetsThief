//
// server
//

// DEBUG
var debug = true;

var port = 8080;


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
            console.log("[CHAT MESSAGE] " + pseudo + ": " + message);
        }
    });

    socket.on('getall_users', function(pattern)
    {
        if (pattern == '')
        {
            socket.emit('getall_users', users);
            if (debug)
            {
                console.log("[GETALL USERS] " + users);
            }
        }
        else
        {
            var corrusers = [];
            for (var i = 0; i < users.length; i++)
            {
                if (users[i].indexOf(pattern) != -1)
                {
                    corrusers.push(users[i]);
                }
            }
            socket.emit('getall_users', corrusers);
            if (debug)
            {
                console.log("[GETALL USERS PATTERN=" + pattern + "] " + corrusers);
            }
        }
    });

    socket.on('send_user', function(user)
    {
        users.push(user);
        io.emit('refresh_users');
        if (debug)
        {
            console.log("[SEND USER] " + user);
        }
    });

    socket.on('disconnect', function()
    {
        users = [];
        io.emit('send_user');
    });
});

http.listen(port, function()
{
    console.log('Listening on port ' + port + '.');
});
