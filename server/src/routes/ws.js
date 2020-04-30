const server = require('http').createServer();

const io = require('socket.io')(server, {
    path: '/ws_vote',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

server.listen(1001, () => {
    console.log(' ws listening on *:1001');
});

var counter = 6;

function update_server(increment){
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            counter += increment
            resolve();
        }, 500);
    } )
}


io.on('connection', (socket) => {
    console.log('a user connected');

    // server recieve events

    socket.on('change_request', async (increment, fn) => {
        await update_server(increment)
        // roadcasting means sending a message to everyone else except for the socket that starts it.
        socket.broadcast.emit('update_local', {counter});

        // make client call its callback, server supply the data 
        fn( {msg: "ok", counter: counter} )
    })


    // server broadcast
    socket.broadcast.emit('user connected');



    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});


