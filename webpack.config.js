module.exports = (env) => {
    if (!env) {
        return require(`./webpack.config.dev.js`);
    } else {
        return require(`./webpack.config.prod.js`);
    }
};
