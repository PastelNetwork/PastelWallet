const path = require('path');

module.exports = {
    entry: './src/main/main.js',
    output: {
        path: path.resolve(__dirname, 'src', 'main'),
        filename: 'main_built.js'
    },
    target: 'electron-main',
    node: {
        __dirname: false
    },
    optimization: {
        minimize: false
    }
};
