const prefix = 'http://localhost:1000'

function get(url){
    // old XMLHttpRequest method for GET
    return new Promise((resolve, reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.withCredentials = true;
        xhr.onload = ()=>{
            resolve(xhr.responseText);
        };
        xhr.onerror = ()=>{
            reject();
        }
        xhr.send();
    })
}

function login(){
    window.location.replace(prefix + '/auth/spotify')
}

function isLogin(){
    return new Promise((resolve, reject) => {
        // return Promise
        // promise resolve when user is logged in
        // promise reject when user is not

        fetch('http://localhost:1000/party/', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8"
        }})
        .then(response => {
            return response.json()
        })
        .then(obj => {
            if (!Array.isArray(obj))
                reject({
                    message: 'server responded: not login',
                    response: obj
                })
            else
                resolve(obj)

        })
    })

}

function createParty(){
    return fetch('http://localhost:1000/party/', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8"
        },
    })
}

function searchItem(searchItem){
    // search music by keyword
    // return Promise, The promise return a array of music when resolved

    let url = 'http://localhost:1000/search?q=' + searchItem + '&type=track&limit=10'
    return fetch(url, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=utf-8'
                }
    })
    .then(response => {
        return response.json()
    })
    .then(obj=>{
        if (!obj.tracks){
            console.error("need log in");
            return []
        }

        let goodArray = obj.tracks.items.map(e => {
            return {
                trackName: e.name,
                albumName: e.album.name,
                artistName: e.artists[0].name,
                albumArt: e.album.images[0].url,
                selected: false
            }
        })

        return goodArray
    })
}


export default {login, isLogin, createParty, searchItem }
