const axios = require('axios');

const TESTNET = false;

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
    return axios.post(`http://localhost:${TESTNET? '19932' : '9932'}`, data, {
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
