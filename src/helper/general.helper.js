const API_URL = 'http://localhost:3000/';

export function request(route, method) {
    return fetch(API_URL + route, 
        {  method });
}

