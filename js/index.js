//
// Global funcs
//

var pseudo = "Anonymous";
var color;

$(document).ready(function()
{
    popupLogin();
    resizeMessages();
});

window.onresize = function(event)
{
    resizeLogin();
    resizeMessages();
}

// 
// Resizes
//

function resizeMessages()
{
    var chat = document.getElementById('chat');
    var messages = document.getElementById('messages');

    // 8 because of bootstrap
    messages.style.height = window.innerHeight - chat.offsetHeight - 8 + "px";
}

function resizeLogin()
{
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var popup = document.getElementById('popup-login');
    popup.style.left = (winW / 2 - popup.offsetWidth / 2) + "px";
    popup.style.top = (winH / 2 - popup.offsetHeight / 2) + "px";
}


//
// Login popup
//

function popupLogin()
{
    resizeLogin();
    $('#container *').prop('disabled', true);
};

function sendLogin()
{
    pseudo = document.getElementById('pseudo').value;
    var selectcolor = document.getElementById('color');
    color = selectcolor.options[selectcolor.selectedIndex].value;

    document.getElementById('popup-login').style.visibility = 'hidden';

    $('#container *').prop('disabled', false);
}

//
// tabs
//
$(function()
{
	$("#tabs").tabs();
});

$("#tabs").tabs({
	active: 0
});

//
// Socket.io
//
var socket = io();


socket.on('chat_message', function(pseudo, message, color)
{
	insertMessage(pseudo, message, color); // Show the message on the page
});

// when the send button is clicked
$('form').submit(function()
{
    var message = escapeHtml($('#send-message').val());
    if (message != "")
    {
        socket.emit('chat_message', pseudo, message, color);
        $('#send-message').val('').focus();
    }
    return false;
});


function insertMessage(pseudo, message,color)
{
    $('#messages').append('<p><span style="background-color:' + color + ';"><b>' + pseudo + ':</b></span> ' + message + '</p>');
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



/*
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



function insertUser(TextListUser)
{
    $("#listuser").html("");
    $('#listuser').append('<p><span style="background-color:"black">' + TextListUser + '</span></p>');
}

function newClient(pseudo)
{
    $('#messages').append('<p><i><font color="red">' + pseudo + '</font></i></p>');
}
*/