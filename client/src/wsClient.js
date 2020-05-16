import io from 'socket.io-client';


const socket = io('http://localhost:1001', {
    path: '/ws_vote'
});

socket.on('update_local', (data) => {
    console.log("update_local recieved", data);
});

function fire_change(num){
    socket.emit('change_request', num, (data) => {
        // callback
        console.log("server responded: ", data);
    });
}

const socket2 = io('http://localhost:1002');


function playListChanged(){
    socket2.emit('change_request', (data) => {
        // callback
        console.log("server responded: ", data);
    });
}


export default { fire_change, socket, playListChanged, socket2}
