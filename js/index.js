var socket = io();

var pseudo;
var color;
             
$(function()
{
    var dialog = $( "#dialog-form" ).dialog({
        autoOpen: true,
        height: 260,
        width: 200,
        modal: true,
        buttons:
        {
            "Login": connect
        }
    });

    form = dialog.find("form").on("submit", function(event)
    {
        event.preventDefault();
    });

    $("#create-user").button().on("click", function()
    {
        dialog.dialog("open");
    });
});

function connect()
{
    pseudo = $('#pseudo').val();
    
    var e = document.getElementById("color");
    couleur = e.options[e.selectedIndex].value;
    
    $('#dialog-form').dialog('close');
    socket.emit('new_client', pseudo);
}

//socket
socket.on('chat message', function(data)
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

$("#formsend").submit(function()
{
    var message = $('#send-message').val();
    if (message != "")
    {
        socket.emit('chat message', message, color);
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