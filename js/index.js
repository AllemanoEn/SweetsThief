//
// Global funcs
//

var pseudo = "Anonymous";
var color;
var chatheight;
var usersheight;

$(document).ready(function()
{
    popupLogin();
    selectChat();
});

window.onresize = function(event)
{
    resizeLogin();
    resizeTabs();
}

//
// tabs
//

function selectChat()
{
    document.getElementById('users').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
    resizeTabs();
}

function selectUsers()
{
    document.getElementById('chat').style.display = 'none';
    document.getElementById('users').style.display = 'block';
    resizeTabs();
}


//
// Resizes
//

function resizeTabs()
{
    var tabs = document.getElementById('tabs');

    var messages = document.getElementById('messages');
    var send = document.getElementById('send');

    var userslist = document.getElementById('userslist');
    var search = document.getElementById('search');

    var chat = document.getElementById('chat');
    var users = document.getElementById('users');

    chat.style.height = "100vh";
    chat.style.height = chat.offsetHeight - tabs.offsetHeight + "px";

    users.style.height = "100vh";
    users.style.height = users.offsetHeight - tabs.offsetHeight + "px";

    messages.style.height = "100vh";
    messages.style.height = messages.offsetHeight - tabs.offsetHeight - send.offsetHeight + "px";

    userslist.style.height = "100vh";
    userslist.style.height = userslist.offsetHeight - tabs.offsetHeight - search.offsetHeight + "px";
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

    $('#popup-login').hide();

    $('#container *').prop('disabled', false);
    sendUser();
}

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


// Function called when button submit of Searchuser is called
function Searchuser() {

alert('coucou');

return true;
}

//
// Socket.io
//
var socket = io();

// GET client
socket.on('chat_message', function(pseudo, message, color)
{
  insertMessage(pseudo, message, color); // Show the message on the page
  updateScroll();
});

socket.on('getall_users', function(users)
{
    setUsers(users);
});

// GET server
socket.on('send_user', function()
{
    sendUser();
});

function sendUser()
{
    socket.emit('send_user', pseudo);
}

function refreshUserslist()
{
    socket.emit('getall_users');
}

function updateScroll()
{
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

//
// Local functions
//

function insertMessage(pseudo, message,color)
{
    $('#messages').append('<p><span style="background-color:' + color + ';"><b>' + pseudo + ':</b></span> ' + escapeHtml(message) + '</p>');
}

function setUsers(users)
{
    $('#userslist').html("");
    for (var i = 0; i < users.length; i++)
    {
        $('#userslist').append('<p><b>' + users[i] + '</b></p>');
    }
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

function sleep(msecs)
{
    var start = new Date().getTime();
    var cur = start;
    while(cur - start < msecs)
    {
        cur = new Date().getTime();
    }
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
