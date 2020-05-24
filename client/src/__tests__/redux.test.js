import store from '../redux/store'
import {updatePlaylist,
    updateRoomInfo,
    updateActiveMusicState,
    updateActiveMusic,
    restoreDefault,
    play,
    pause} from '../redux/actions'

// the store is already created in store.js
// so here a action restoreDefault is dispatched

let defaultStore = {
    activeMusicUri: undefined,
    activeMusicState: 'STOP',    // 'STOP', 'PAUSE' or 'PLAYING'
    roomId : 0,
    userName : '',      // host's name
    musicInfo : [],
    iniAtLanding: false     // prevent multiple request when redirected to host/guest page through landing page
}


beforeEach(() => {
    store.dispatch(restoreDefault())
})

// 
it('update room info', () => {
    store.dispatch(updateRoomInfo({
        userName: 'poknz',
    }))

    let s = store.getState()
    let keys = Object.keys(s)

    // undefined attribute does not count
    expect(keys.length).toBe(5)
    expect(s.activeMusicUri).toBeUndefined()

    expect(s).toEqual(Object.assign({}, defaultStore, {userName: 'poknz'}))
})

it('update playlist', () => {
    let arr = [{name: 'b', votes: 0}, {name: 'a', votes: 2}]

    store.dispatch(updatePlaylist(arr))

    let s = store.getState()

    // expect different reference
    expect(arr).not.toBe(s.musicInfo)

    // expect same content
    expect(s.musicInfo).toEqual(arr)

    // should not be null or undefined
    expect.anything(s.activeMusicUri)
})

it('update active music uri', () => {
    let arr = [
        {name: 'b', votes: 0, uri: '123'}, 
        {name: 'a', votes: 2, uri: 'lol'}]
    store.dispatch(updatePlaylist(arr))

    store.dispatch(updateActiveMusic('lol'))

    let s = store.getState()

    // expect updated uri
    expect(s.activeMusicUri).toBe('lol')

    // must be in 'PLAYING' state
    expect(s.activeMusicState).toBe('PLAYING')

    // expect same playlist content
    expect(s.musicInfo).toEqual(arr)

})