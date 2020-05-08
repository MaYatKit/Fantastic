// implicit oauth
// call getToken() to get a existing token.
// if there is no lcoally existing token, browser redirects to spotify to request a new one.

function getHashObject(){
    // #a=1&b=2    
    // =>     {a: 1, b: 2}
    return window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
        if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {})
}

function getTokenFromURL(){
    // #access_token=#####
    // &token_type=Bearer
    // &expires_in=3600 (seconds)
    let token = getHashObject()["access_token"];
    let expire_len = getHashObject()["expires_in"];
    let expire_by = Date.now() + expire_len * 1000
    if(token === undefined){
        return null
    }else{
        sessionStorage.setItem('spotify_token_implicit', token);
        sessionStorage.setItem('spotify_token_implicit_expire', expire_by)
        window.location.hash = '';
        return token;
    }
}

function requestToken(){
    const authEndpoint = 'https://accounts.spotify.com/authorize';

    // Replace with your app's client ID, redirect URI and desired scopes
    const clientId = '38c1268007c94332bec6779dadad7837';
    const redirectUri = 'http://localhost:3000';
    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-modify-playback-state'    // getting user devices
    ];

    // If there is no token, redirect to Spotify authorization
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;

}

function getToken(){
    let token = sessionStorage.getItem('spotify_token_implicit');
    let expire_by = new Date(Number(sessionStorage.getItem('spotify_token_implicit_expire')))

    if(token !== null && Date.now() < expire_by)
        return token;

    token = getTokenFromURL();
    if(token !== null)
        return token;

    requestToken();
}

export default {
    getHashObject, getTokenFromURL, getToken
}