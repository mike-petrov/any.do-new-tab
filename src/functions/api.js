import axios from 'axios';

const server = 'https://sm-prod2.any.do';

function serverRequest(link, json = {}) {
    return axios.post(server + link, json);
}

export function authUser(json) {
    return new Promise((resolve) => {
        serverRequest('/login', json).then((res) => {
            resolve(res.data);
        });
    });
}
