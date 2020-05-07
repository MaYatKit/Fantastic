import playBack from '../playBack'

// Define action types here

const TEST_ACTION = "TEST_ACTION"
const TEST_ADD_MOCKDATA = "TEST_ADD_MOCKDATA";
const REFREASH_HOSTPAGE = "REFREASH_HOSTPAGE";
const REFREASH_PLAYLIST = "REFREASH_PLAYLIST";
const UPDATE_ACTIVE_MUSIC_STATE = "UPDATE_ACTIVE_MUSIC_STATE";
const UPDATE_ACTIVE_MUSIC = "UPDATE_ACTIVE_MUSIC";



// define action creators here
let testActionCreator = (content) => {
    return {
        type: TEST_ACTION,
        content: content
    }
}

// define action creators here
let refreshHostPage = (data) => {
    return {
        type: REFREASH_HOSTPAGE,
        data: data
    }
};

// define action creators here
let refreshPlaylist = (data) => {
    return {
        type: REFREASH_PLAYLIST,
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

function play(uri){
    return function(dispatch, getState){
        // getState(): return a object containing the redux state
        let s = getState()
        let fetchFn, dispatchFn, dArg;

        // play a new one or resume 
        if( uri !== s.activeMusicUri ){
            fetchFn = playBack.play
            dispatchFn = updateActiveMusic
            dArg = uri
        }else{
            fetchFn = playBack.resume
            dispatchFn = updateActiveMusicState
            dArg = 'PLAYING'
        }

        return fetchFn(uri)
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




export {testActionCreator, 
        refreshHostPage, 
        refreshPlaylist, 
        updateActiveMusicState, 
        updateActiveMusic, 
        play,
        pause}
