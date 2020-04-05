import axios from 'axios';

const server = 'https://sm-prod2.any.do';

function serverRequest(link, json = {}, headers) {
    return axios.post(server + link, json, headers);
}

export function authUser(json) {
    return new Promise((resolve) => {
        serverRequest('/login', json).then((res) => {
            resolve(res.data);
        });
    });
}

export function tasksSync(token) {
    return new Promise((resolve) => {
        const headers = {
            headers: {
                'X-Anydo-Auth': token,
                'Content-type': 'application/json',
            },
        };
        const json = {
            models: {
                category: {
                    items: [],
                },
                task: {
                    items: [],
                    config: {
                        includeDone: false,
                        includeDeleted: false,
                    },
                },
                attachment: {
                    items: [],
                },
                sharedMember: {
                    items: [],
                },
                userNotification: {
                    items: [],
                },
                taskNotification: {
                    items: [],
                },
            },
        };
        serverRequest('/api/v2/me/sync?updatedSince=0', json, headers).then((res) => {
            resolve(res.data);
        });
    });
}
