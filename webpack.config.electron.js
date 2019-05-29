const path = require('path');

module.exports = {
    entry: './src/main_electron.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main_electron.js'
    },
    target: 'electron-main',
    node: {
        __dirname: false
    }
};