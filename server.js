var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function(socket){
  socket.on('chat_message', function(pseudo, message, color){
	//console.log(message); Affiche les msg dans la console
    io.emit('chat_message', pseudo, message, color);
  });
});

http.listen(3000, function(){
  console.log('listening on :3000');
});