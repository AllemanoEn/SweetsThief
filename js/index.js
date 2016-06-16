var socket = io();

var pseudo;
var couleur;
             
$(function()
{
    var dialog = $( "#dialog-form" ).dialog({
        autoOpen: true,
        height: 260,
        width: 200,
        modal: true,
        buttons:
        {
            "Se connecter": connect
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
    pseudo=$('#pseudo').val();
    
    var e = document.getElementById("couleur");
    couleur = e.options[e.selectedIndex].value;
    
    $('#dialog-form').dialog('close');
    socket.emit('nouveau_client', pseudo);
}

//socket
socket.on('chat message', function(data)
{
    if (data.pseudo != pseudo)
    {
        insereMessage(data.pseudo, data.msg, data.couleur);
    }
});

socket.on('nouveau_client', function(pseudo_nouveauclient)
{
    if (pseudo_nouveauclient != pseudo)
    {
        nouveauclient(pseudo_nouveauclient + ' vient de se connecter !');
    }   
});

socket.on('ListUser', function(TextListUser)
{
    insereUser(TextListUser);
}); 

socket.on('get pseudo', function()
{
    socket.emit('get pseudo', pseudo);
}); 

$("#formsend").submit(function()
{
    var message = $('#send-message').val();
    if (message != "")
    {
        socket.emit('chat message', message, couleur);
        insereMessage(pseudo, message, couleur); // Affiche le message aussi sur notre page
        $('#send-message').val('').focus();
    }
    return false;
});


// Ajoute un message dans la page
function insereMessage(pseudo, message,couleur)
{
    $('#messages').prepend('<p><span style="background-color:' + couleur + ';">' + pseudo + ' :</span> ' + message + '</p>');
}

function insereUser(TextListUser)
{
    $("#listuser").html("");
    $('#listuser').prepend('<p><span style="background-color:"black">' + TextListUser + '</span></p>');
}

function nouveauclient(pseudo)
{
    $('#messages').prepend('<p><i><font color="red">' + pseudo + '</font></i></p>');
}