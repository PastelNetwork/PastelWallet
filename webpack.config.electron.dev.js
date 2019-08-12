const path = require('path');

module.exports = {
    entry: './src/main_electron.js',
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'main_electron_built.js'
    },
    target: 'electron-main',
    node: {
        __dirname: false
    }
};