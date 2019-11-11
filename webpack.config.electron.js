const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js'
    },
    target: 'electron-main',
    node: {
        __dirname: false
    },
    optimization: {
        minimize: false
    },
};