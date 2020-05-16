// const server = require('http').createServer();
//
//
// const io = require('socket.io')(1002);
//
// // server.listen(1002, () => {
// //     console.log(' ws listening on *:1002');
// // });
//
//
// // io.on('connection', socket => {
// //     console.log('a user connected');
// //
// //     // server recieve events
// //
// //
// // });
// io.on('change_request', (socket)  => {
//     socket.broadcast.emit('refresh_play_list');
// });
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

// io.on('change_request', (socket) => {
//     socket.broadcast.emit('refresh_play_list');
// });





