
const express = require('express');

const server = require('http').Server(express);
const io = require('socket.io')(server);
server.listen(1002);

io.on('connection', (socket) => {

    socket.on('change_request', () => {
        socket.emit( "Sever received changing message !!!");
        //Notify other clients
        socket.broadcast.emit('refresh_play_list');
    });

});