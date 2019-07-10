const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: __dirname + '/demo/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [__dirname + '/demo/', __dirname + '/packages/'],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                include: [__dirname + '/demo'],
                loader: 'style-loader!css-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/demo/index.html',
        }),
    ],
    devServer: {
        port: 8023,
    },
}
