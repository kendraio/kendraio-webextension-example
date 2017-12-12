const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src/main.ts'),
        action: path.join(__dirname, 'src/action.ts'),
        vendor: ['moment']
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [

        // pack common vendor files
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};