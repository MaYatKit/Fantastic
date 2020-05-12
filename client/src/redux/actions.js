import playBack from '../playBack'

// Define action types here

const READ_LOCAL_LIST = "READ_LOCAL_LIST";
const REFREASH_HOSTPAGE = "REFREASH_HOSTPAGE";
const REFREASH_PLAYLIST = "REFREASH_PLAYLIST";
const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
const UPDATE_ACTIVE_MUSIC_STATE = "UPDATE_ACTIVE_MUSIC_STATE";
const UPDATE_ACTIVE_MUSIC = "UPDATE_ACTIVE_MUSIC";


// define action creators here
let refreshHostPage = (data) => {
    return {
        type: REFREASH_HOSTPAGE,
        data: data
    }
};

let readLocalList = () => {
    return{
        type: READ_LOCAL_LIST,
        data: undefined
    }
}

let refreshPlaylist = (data) => {
    return {
        type: REFREASH_PLAYLIST,
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
    // s: 'PAUSE' or 'PLAYING'
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

// ---------------async actions-----------------

function play(event){
    // {
    //     nextState: 'PAUSE' or 'PLAYING'
    //     uri,
    //     resume: boolean
    // }
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
        readLocalList,
        refreshHostPage, 
        refreshPlaylist, 
        updateActiveMusicState, 
        updateActiveMusic, 
        play,
        pause}
