var socket = io();

var pseudo = "Anonymous";
var color;

$(document).ready(function()
{
    popupLogin();
});

function connect()
{
	/*
    pseudo = escapeHtml($('#pseudo').val());
    
    var e = document.getElementById("color");
    couleur = e.options[e.selectedIndex].value;
    
    $('#login-form').dialog('close');
	*/
    socket.emit('new_client', 'Enzolo');
}

function popupLogin()
{
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var popup = document.getElementById('popup-login');
    popup.style.left = (winW / 2 - 150) + "px";
    popup.style.top = (winH / 2 - 150) + "px";
};

function sendLogin()
{
    pseudo = document.getElementById('pseudo').value;
    var selectcolor = document.getElementById('color');
    color = selectcolor.options[selectcolor.selectedIndex].value;

    document.getElementById('popup-login').style.visibility = 'hidden';
}

//
//socket
//

socket.on('chat_message', function(data)
{
    if (data.pseudo != pseudo)
    {
        insertMessage(data.pseudo, data.msg, data.couleur);
    }
});

socket.on('new_client', function(pseudo_nouveauclient)
{
    if (pseudo_nouveauclient != pseudo)
    {
        newClient(pseudo_nouveauclient + ' has just connected !');
    }   
});

socket.on('list_user', function(TextListUser)
{
    insertUser(TextListUser);
}); 

socket.on('get_pseudo', function()
{
    socket.emit('get_pseudo', pseudo);
}); 

// when the send button is clicked
$("#formsend").submit(function()
{
    var message = escapeHtml($('#send-message').val());
    if (message != "")
    {
        socket.emit('chat_message', message, color);
        insertMessage(pseudo, message, color); // Show the message on the page
        $('#send-message').val('').focus();
    }
    return false;
});



// Ajoute un message dans la page
function insertMessage(pseudo, message,couleur)
{
    $('#messages').append('<p><span style="background-color:' + color + ';"><b>' + pseudo + ':</b></span> ' + message + '</p>');
}

function insertUser(TextListUser)
{
    $("#listuser").html("");
    $('#listuser').append('<p><span style="background-color:"black">' + TextListUser + '</span></p>');
}

function newClient(pseudo)
{
    $('#messages').append('<p><i><font color="red">' + pseudo + '</font></i></p>');
}

// replace chars to html chars
function escapeHtml(text)
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//
// fun part
//


// if it's December
var today = new Date();
if (today.getMonth() == 11)
{
    document.write('<script src="js/snowstorm.js" type="text/javascript"></script>');
}