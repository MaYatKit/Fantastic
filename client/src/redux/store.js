import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
// const initState = {
//     activeMusicUri: undefined,
//     activeMusicState: 'PAUSE',    // 'PAUSE' or 'PLAYING'
//     roomId : sessionStorage.getItem('roomId')!=="undefined"?sessionStorage.getItem('roomId'):0,
//     userName : sessionStorage.getItem('userName')!=="undefined"?sessionStorage.getItem('userName'):"initial name",
//     musicInfo : sessionStorage.getItem('musicInfo')!=="undefined"?JSON.parse(sessionStorage.getItem('musicInfo')):[],
// };

const initState = {
        activeMusicUri: undefined,
        activeMusicState: 'STOP',    // 'STOP', 'PAUSE' or 'PLAYING'
        roomId : 0, 
        userName : '',      // host's name
        musicInfo : [],
        iniAtLanding: false     // prevent multiple request when redirected to host/guest page through landing page
    };


function appReducer(prevState = initState, action) {
    if (typeof prevState === 'undefined') {
        return Object.assign({}, initState);
    }

    let newS = JSON.parse(JSON.stringify(prevState))

    switch (action.type) {
        // case 'REFREASH_HOSTPAGE':
        //     const newState = JSON.parse(JSON.stringify(prevState));
        //     newState.roomId = action.data["room_id"];
        //     newState.userName = action.data["name"];
        //     if (action.data["tracks"] == null){
        //         newState.musicInfo = []
        //     }else {
        //         newState.musicInfo = Array.from(action.data["tracks"]);
        //     }
        //     sessionStorage.setItem('roomId',newState.roomId);
        //     sessionStorage.setItem('userName',newState.userName);
        //     sessionStorage.setItem('musicInfo',JSON.stringify(newState.musicInfo));
        //     if(newState.musicInfo.length > 0){
        //         newState.activeMusicUri = newState.musicInfo[0].uri
        //     }
        //     return newState;
        // case 'REFREASH_PLAYLIST':
        //     const state = JSON.parse(JSON.stringify(prevState));
        //     sessionStorage.setItem('musicInfo',JSON.stringify(action.data));
        //     state.musicInfo = action.data;
        //     break;

        // case 'READ_LOCAL_LIST':
            // let local = {
            //     activeMusicUri: undefined,
            //     activeMusicState: 'STOP',    // 'STOP', 'PAUSE' or 'PLAYING'
            //     roomId : sessionStorage.getItem('roomId'),
            //     userName : sessionStorage.getItem('userName'),
            //     musicInfo : sessionStorage.getItem('musicInfo')!==null?JSON.parse(sessionStorage.getItem('musicInfo')):[],
            // };
            // // local.musicInfo = local.musicInfo.sort(e => -e.votes)
            // local.activeMusicUri = local.musicInfo.length > 0 ? local.musicInfo[0].uri : undefined
            // return local

        case 'UPDATE_ROOM_INFO':
            // expected input: a object that has matching attributes of the store
            // local playlist is not updated here
            return Object.assign(newS, action.data)

        case 'UPDATE_PLAYLIST':
            // expected input: Object[]
            // let musicInfo = action.data.sort(e => -e.votes)
            let musicInfo = Array.from(action.data);
            Object.assign(newS, {
                musicInfo: musicInfo,
                activeMusicUri: musicInfo.length > 0 ? musicInfo[0].uri : undefined,
                activeMusicState: 'PAUSE'
            })
            // sessionStorage.setItem('musicInfo',JSON.stringify(musicInfo));
            return newS


        case 'UPDATE_ACTIVE_MUSIC':

            Object.assign(newS, {
                activeMusicUri: action.data,
                activeMusicState: 'PLAYING'
            })
            return newS;

        case 'UPDATE_ACTIVE_MUSIC_STATE':
            Object.assign(newS, {activeMusicState: action.data})
            return newS;;

        default:
            return Object.assign({}, prevState);
    }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.

// It looks like you are passing several store enhancers to createStore().
// This is not supported. Instead, compose them together to a single function
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
    appReducer,
    composeEnhancer(applyMiddleware(thunk))
)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

// store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.


export default store;
