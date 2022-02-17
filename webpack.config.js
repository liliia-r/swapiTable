const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) =>
    isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './index.js',
    devtool: 'source-map',
    output: {
        filename: `./${filename('js')}`,
        path: path.resolve(__dirname, 'dist'), // where to put our build
        assetModuleFilename: 'assets/[hash][ext][query]',
    },

    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 3001,
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd,
            },
        }),

        new CleanWebpackPlugin(), // remove unused files in "dist" folder

        new MiniCssExtractPlugin({
            // copy css file to "dist" folder
            filename: `./${filename('css')}`,
        }),
    ],

    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader'], // update html file on save
            },

            {
                test: /\.(s[ac]|c)ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },

            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: isProd ? 'asset' : 'asset/resource',
            },

            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },
};
