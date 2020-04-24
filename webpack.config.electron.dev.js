const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'src'),
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
