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
const initState = {
    activeMusicUri: undefined,
    activeMusicState: 'PAUSE',    // 'PAUSE' or 'PLAYING'
    testNum : 2222,
    roomId : sessionStorage.getItem('roomId')!=="undefined"?sessionStorage.getItem('roomId'):0,
    userName : sessionStorage.getItem('userName')!=="undefined"?sessionStorage.getItem('userName'):"initial name",
    musicInfo : sessionStorage.getItem('musicInfo')!=="undefined"?JSON.parse(sessionStorage.getItem('musicInfo')):[
        {
            name: "Norway Ice",
            album: "Ice 2004",
            icon: "https://1.bp.blogspot.com/-PjjZ8IdgL4o/XFdM0rw8jgI/AAAAAAAAAbA/n5PceMU_W4g2qCkBL--1CN531O15GNQuACLcBGAs/s1600/bandcamp-button-square-green-256.png",
            votes: 6
        }
    ],
};


function appReducer(prevState = initState, action) {
    if (typeof prevState === 'undefined') {
        return Object.assign({}, initState);
    }

    let newS = JSON.parse(JSON.stringify(prevState))

    switch (action.type) {
        case 'REFREASH_HOSTPAGE':
            const newState = JSON.parse(JSON.stringify(prevState));
            sessionStorage.setItem('roomId',action.data[0]["id"] );
            sessionStorage.setItem('userName',action.data[0]["name"] );
            // sessionStorage.setItem('musicInfo',JSON.stringify(action.data[0]["tracks"]));
            newState.roomId = action.data[0]["id"];
            newState.userName = action.data[0]["name"];
            newState.musicInfo = action.data[0]["tracks"];
            return newState;
        case 'REFREASH_PLAYLIST':
            const state = JSON.parse(JSON.stringify(prevState));
            sessionStorage.setItem('musicInfo',JSON.stringify(action.data));
            state.musicInfo = action.data;
            break;

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
