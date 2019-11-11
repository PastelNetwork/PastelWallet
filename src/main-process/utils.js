const axios = require('axios');

const callRpcMethod = (method, params) => {
    // return Promise
    let data = {
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": method
    };
    if (params) {
        data.params = params;
    }
    return axios.post('http://localhost:19932', data, {
        headers: {
            'Content-Type': 'text/plain'
        },
        auth: {
            username: 'rt',
            password: 'rt'
        }
    });
};

module.exports = callRpcMethod;