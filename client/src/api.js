const prefix = 'http://localhost:1000'

function get(url){
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

function fetch1(){
    get(prefix + '/auth/spotify')
    .then(console.log)
}

function open(){
    window.open(prefix + '/auth/spotify')    // eslint error
}

function replace(){
    window.location.replace(prefix + '/auth/spotify')
}

export default { fetch1, open, replace }