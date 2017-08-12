const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: './dist'
    },
    entry: {
        app: ['src/index.js'],
        vendor: ['src/vendor.js'],
        hello: ['src/js/hello.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'assets/[name].[chunkHash:6].bundle.js',
        // publicPath: '/webpack-demo/dist/',
        publicPath: '/',
    },
    module: {
        rules: [
            // js babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            // scss 轉譯 , 然後使用時再動態塞入<style></style>到html. 
            // ps:執行順序是從右到左 => sass-loader -> css-loader -> style-loader
            // {
            //     test: /\.(scss|css)$/,
            //     use: [ 'style-loader', 'css-loader' , 'sass-loader' ]
            // },
            // scss 轉譯 , 然後藉由 ExtractTextPlugin , 輸出成一個css檔案.
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader',
                }),
            },
            // images 處理 (小於10kb 轉成 data url)
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'assets/images/[name].[ext]'
                        }
                    },
                    'image-webpack-loader'
                ]
            },
            // 導出模組裡的jQuery成為全域
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }, {
                    loader: 'expose-loader',
                    options: 'jQueryWTF'
                }]
            }
        ]
    },
    plugins: [
        // 編譯前先刪除dist
        new CleanWebpackPlugin(['dist'], {
            "verbose": true
        }),
        // chunkHash && 緩存相關
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
        }),
        // 輸出html , 加上 script tags , 外加 img處理.
        new HtmlWebpackPlugin({
            title: '首頁',
            filename: 'index.html',
            template: 'html-withimg-loader?min=false!' + path.resolve(__dirname, './src/index.html'),
            chunksSortMode: 'manual',
            minify: false,
            chunks: ['runtime', 'vendor', 'hello', 'app', ]
        }),
        // css抽出成一個檔案 , 加上 link tag.
        new ExtractTextPlugin('assets/[name].[contenthash:6].css'),
        // js壓縮醜化.
        // new UglifyJSPlugin({
        //     mangle: {
        //         // Skip mangling these
        //         except: ['$super', '$', 'exports', 'require', 'default']
        //     }
        // })
    ]
}