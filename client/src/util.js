function getParamFromUrl_test(str){
    let query = str.split('&');
    query[0] = query[0].split('?')[1];
    let param = {};
    for (let i = 0; i < query.length; i++) {
        let q = query[i].split('=');
        if (q.length === 2) {
            param[q[0]] = q[1].replace('%20', ' ');
        }
    }
    return param;
}

function getParamFromUrl() {
    if (window.location.search === '') {
        window.location.href = '/';
    }
    let query = window.location.search.split('&');
    query[0] = query[0].split('?')[1];
    let param = {};
    for (let i = 0; i < query.length; i++) {
        let q = query[i].split('=');
        if (q.length === 2) {
            param[q[0]] = q[1].replace('%20', ' ');
        }
    }
    return param;
}

export default {getParamFromUrl_test, getParamFromUrl}