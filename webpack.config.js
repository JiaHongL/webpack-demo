const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: './dist'
    },
    entry: {
        index: ['./src/index.js', './src/js/myjs.js' ,'./src/style/scss/pages/t.js'],
        // about: ['./src/about.js', './src/js/myjs2.js'],
        vendor: ['./src/vendor.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: './',
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
            // scss 轉譯
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader',
                }),
            },
            // images 處理
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 6000,
                            name: 'images/[name].[ext]'
                        }
                    },
                    'image-webpack-loader'
                ]
            },
            // html不壓縮
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: false
                    }
                }
            },
            // 導出jQuery成為全域變數
            {
                test: require.resolve('jquery'),
                use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }, {
                        loader: 'expose-loader',
                        options: '$'
                    },
                    {
                        loader: 'expose-loader',
                        options: 'jQueryWhy?'
                    }
                ]
            }
        ]
    },
    plugins: [
        // html 加上js連結 && img處理
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: 'html-withimg-loader!' + path.resolve(__dirname, './src/index.html'),
            chunksSortMode: 'manual',
            chunks: ['vendor', 'index']
        }),
        // html 加上js連結 && img處理
        // new HtmlWebpackPlugin({
        //     title: 'about',
        //     filename: 'about.html',
        //     template: 'html-withimg-loader!' + path.resolve(__dirname, './src/about.html'),
        //     chunksSortMode: 'manual',
        //     chunks: ['about']
        // }),
        // css抽出成一個檔案.
        new ExtractTextPlugin('[name].css'),
        // js壓縮醜化.
        // new UglifyJSPlugin({
        //     mangle: {
        //         // Skip mangling these
        //         except: ['$super', '$', 'exports', 'require', 'default']
        //     }
        // })
    ]
}