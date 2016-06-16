var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/jquery-ui.js', function(req, res){
  res.sendFile(__dirname + '/jquery-ui-1.11.4.custom/jquery-ui.min.js');
});

app.get('/jquery-ui.css', function(req, res){
  res.sendFile(__dirname + '/jquery-ui-1.11.4.custom/jquery-ui.min.css');
});

app.get('/jquery-ui.structure.min.css', function(req, res){
  res.sendFile(__dirname + '/jquery-ui-1.11.4.custom/jquery-ui.structure.min.css');
});

app.get('/jquery-ui.theme.min.css', function(req, res){
  res.sendFile(__dirname + '/jquery-ui-1.11.4.custom/jquery-ui.theme.min.css');
});


var ListUser = [];

var TextListUser ="";

setInterval(function(){ sendUserList(io.sockets) }, 2000);

io.sockets.on('connection', function (socket, pseudo) {
	
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
		socket.on('nouveau_client', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo); //broadcast.emit envoie à tout le monde sauf à la socket qui l'a démarrer
		
		ListUser.push(pseudo); // Ajoute un utilisateur à la liste
		
		TextListUser = ""
		for (var i = 0; i < ListUser.length; i++){
			TextListUser = TextListUser + ListUser[i] + "<br>";
		}
		socket.broadcast.emit('ListUser', TextListUser); //broadcast.emit envoie à tout le monde sauf à la socket qui l'a démarrer
		socket.emit('ListUser', TextListUser); // Alors on doit aussi l'envoyer à celui qui a démarrer le broadcast
		
		
		console.log(pseudo + ' est connecté !');
    });
	
	socket.on('chat message', function(msg, couleur){
		io.emit('chat message', {pseudo: socket.pseudo, msg, couleur});
		//console.log(msg);
	});
	
	socket.on('disconnect', function (){	
		ListUser = [];
		TextListUser = "";
		socket.broadcast.emit('get pseudo');	//Quand un utilisateur se déconnecte le serveur demande a tout le monde (socket) son pseudo
		
	});
	
	socket.on('get pseudo', function (pseudo){	//Ici le serveur recoit les pseudos 
		ListUser.push(pseudo);	
		TextListUser = TextListUser + pseudo + "<br>";
		
	});
	
});

http.listen(3000, function(){
  console.log('Server listening on port 3000');
});

function sendUserList(socket) {
    socket.emit('ListUser', TextListUser);
}
