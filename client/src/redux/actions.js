import playBack from '../playBack'

// Define action types here

const UPDATE_ROOM_INFO = "UPDATE_ROOM_INFO";
const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
const UPDATE_ACTIVE_MUSIC_STATE = "UPDATE_ACTIVE_MUSIC_STATE";
const UPDATE_ACTIVE_MUSIC = "UPDATE_ACTIVE_MUSIC";
const RESTORE_DEFAULT = "RESTORE_DEFAULT";


let updateRoomInfo = (data) => {
    // expected input: a object that has matching attributes of the store
    return {
        type: UPDATE_ROOM_INFO,
        data: data
    }
};

let updatePlaylist = (data) => {
    // data: array of music info
    return {
        type: UPDATE_PLAYLIST,
        data: data
    }
};

let updateActiveMusicState = (s) => {
    // s: 'PAUSE' or 'PLAYING' or 'STOP'
    return {
        type: UPDATE_ACTIVE_MUSIC_STATE,
        data: s
    }
};

let updateActiveMusic = (uri) => {
    return {
        type: UPDATE_ACTIVE_MUSIC,
        data: uri
    }
};

let restoreDefault = () => {
    return {
        type: RESTORE_DEFAULT,
        data: undefined
    }
};

// ---------------async actions-----------------

function play(event){
    return function(dispatch, getState){
        // getState(): return a object containing the redux state
        let s = getState()
        let fetchFn, dispatchFn, dArg;

        // play a new one or resume
        if( event.resume ){
            fetchFn = playBack.resume
            dispatchFn = updateActiveMusicState
            dArg = event.nextState
        }else{
            fetchFn = playBack.play
            dispatchFn = updateActiveMusic
            dArg = event.uri
        }

        return fetchFn(event.uri)
        .then(response => {
                console.log('Player response: ' + response.url + ', status = ' + response.status);
                if (response.status === 204) {
                    dispatch( dispatchFn(dArg) )
                }
                return response;
        })
    }
}


function pause(){
    return function(dispatch, getState){
        return playBack.pause()
        .then(response => {
            console.log('Player response: ' + response.url + ', status = ' + response.status);
            if (response.status === 204) {
                // playing = false;
                dispatch( updateActiveMusicState('PAUSE') );
                return response
            }
        });
    }
}




export {updatePlaylist,
        updateRoomInfo,
        updateActiveMusicState,
        updateActiveMusic,
        restoreDefault,
        play,
        pause}
