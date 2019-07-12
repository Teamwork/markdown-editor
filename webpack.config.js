const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: __dirname + '/demo/index.js',
    output: {
        path: __dirname + '/docs/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [__dirname + '/demo/', __dirname + '/packages/'],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                include: [
                    __dirname + '/demo',
                    __dirname + '/node_modules/codemirror/',
                    __dirname + '/packages/',
                ],
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
        open: true,
        port: 8023,
    },
}
