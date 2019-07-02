module.exports = function (custom) {
    const config = {
        test: /\.jsx?$/,
        exclude: /((node_modules\/(?!@maelstrom-cms\/(.*)))|bower_components)/,
        use: [{
            loader: 'babel-loader',
            options: Config.babel(),
        }],
    };

    return Object.assign(config, custom)
}
