//
// Global funcs
//

var pseudo = "Anonymous";
var color;

var lvlcook = 0;
var lvlchefs = 0;
var lvlfactory = 0;

var MCOOK = 1;
var MCHEFS = 2;
var MFACTORY = 4;

var sweets = 0;

$(document).ready(function()
{
    popupLogin();
    selectStats();
    updateStats();
    setInterval(timer, 1000);
});

$('#search').on('input', function()
{
    searchUser();
})

window.onresize = function(event)
{
    resizeLogin();
    resizeTabs();
}

function timer()
{
    sweets += lvlcook * MCOOK;
    sweets += lvlchefs * MCHEFS;
    updateStats();
}

//
// Cook
//

function upgradeCook()
{
    lvlcook += 1;
    updateStats();
}

function upgradeChefs()
{
    lvlchefs += 1;
    updateStats();
}

function upgradeFactory()
{
    lvlfactory += 1;
    updateStats();
}

function updateStats()
{
    var stats = document.getElementById('stats');

    var cook = lvlcook * MCOOK;
    var chefs = lvlchefs * MCHEFS;
    var factory = lvlfactory * MFACTORY;

    stats.innerHTML = "<p><b>Cook: </b>" + cook + " Sweets/sec</p>";
    stats.innerHTML += "<p><b>Chefs: </b>" + chefs + " Sweets/sec</p>";
    stats.innerHTML += "<p><b>Factory: </b>" + " Sweets/sec</p><br/>";
    stats.innerHTML += "<p><b>Total per second: </b>" + (cook + chefs + factory) + " Sweets/sec</p><br/>";
    stats.innerHTML += "<p><b>Total: </b>" + sweets + " Sweets</p><br/>";
}


//
// tabs
//

function selectStats()
{
    document.getElementById('stats').style.display = 'block';
    document.getElementById('users').style.display = 'none';
    document.getElementById('chat').style.display = 'none';
    resizeTabs();
}

function selectUsers()
{
    document.getElementById('stats').style.display = 'none';
    document.getElementById('users').style.display = 'block';
    document.getElementById('chat').style.display = 'none';
    resizeTabs();
}

function selectChat()
{
    document.getElementById('stats').style.display = 'none';
    document.getElementById('users').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
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

    var stats = document.getElementById('stats');

    chat.style.height = "100vh";
    chat.style.height = chat.offsetHeight - tabs.offsetHeight + "px";

    users.style.height = "100vh";
    users.style.height = users.offsetHeight - tabs.offsetHeight + "px";

    messages.style.height = "100vh";
    messages.style.height = messages.offsetHeight - tabs.offsetHeight - send.offsetHeight + "px";

    userslist.style.height = "100vh";
    userslist.style.height = userslist.offsetHeight - tabs.offsetHeight - search.offsetHeight + "px";

    stats.style.height = "100vh";
    stats.style.height = stats.offsetHeight - tabs.offsetHeight + "px";
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

// when an user login
function sendLogin()
{
    pseudo = document.getElementById('pseudo').value;
    var selectcolor = document.getElementById('color');
    color = selectcolor.options[selectcolor.selectedIndex].value;

    $('#popup-login').hide();

    $('#container *').prop('disabled', false);
    sendUser();
    return false;
}

// when the send button is clicked
function sendMessage()
{
    var message = escapeHtml($('#send-message').val());
    if (message != "")
    {
        socket.emit('chat_message', pseudo, message, color);
        $('#send-message').val('').focus();
    }
    return false;
};


// Function called when button search is clicked
function searchUser()
{
    refreshUserslist();
    return false;
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

socket.on('refresh_users', function()
{
    refreshUserslist();
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
    var pattern = $('#search-user').val();
    socket.emit('getall_users', pattern);
}

function updateScroll()
{
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}

//
// Local functions
//

function insertMessage(pseudo, message, color)
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

// format numbers, example: 2.33000004 -> 2.33
/*
function formatNumber(num)
{
    var numf = String(num);
    if (numf.includes("."))
    {
        var cs = numf.split('.');
        numf = cs[0] + "." + cs[1].substring(0, 2);
    }
    return Number(numf);
}


Math.m = function()
{
    var f = _cf.apply(null, arguments);
    function cb(x, y, i, o)
    {
        return (x * f) * (y * f) / (f * f);
    }
    return Array.prototype.reduce.call(arguments, cb, 1);
};
*/

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
