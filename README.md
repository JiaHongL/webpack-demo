## ㄧ、前提
&emsp; 這是一個簡單介紹webpack設定的Demo，基本上都是從官網文件介紹的方式來進行配置.    
>使用 webpack 3.4.1

<br />

## 二、何謂Webpack模組化？
 
&emsp; webpack是一套前端模組化的打包工具，較適合用來打包以SPA(Single Page Application)為架構的專案，但它不只是單純的進行打包，而是可以把所有資源進行模組化後，來進行webpack本身的模組隔離與載入運作功能，這樣講可能很抽象，我們來看下面這個打包的例子.  

```sh 
我們有兩個JS檔案和一個index.html，藉由webpack打包後，會插入兩個script tag到index.html.(先不管webpack如何打包)

1.hello.js

    var GlobalVariable = 'hello world';
    console.log(GlobalVariable);
    console.log(typeof GlobalVariable);


2.index.js

    console.log(typeof GlobalVariable);


3.index.html

    <html class='no-js' lang='en'>
        <head></head>
        <body>
            <script type="text/javascript" src="/assets/hello.bundle.js"></script>
            <script type="text/javascript" src="/assets/index.bundle.js"></script>
        </body>
    </html>


還未理解模組化打包的情況下，我們會認為它只是進行壓縮醜化之類的打包而已，而會預期GlobalVariable會是個全域變數.

預期的結果
    hello world
    string
    string

但實際上是
    hello world
    string
    undefined

```

&emsp; 如下圖，我們會看到它不只是單純的把程式碼打包到檔案裡，而是打包到由webpack所建構的module，然後再進行模組運作讓程式碼跑起來，所以GlobalVariable當然就不是一個全域變數了，這個JS模組的概念在node.js比較常運用，主要是為了避免對全域的污染與作用區的不明確.

![alt text](https://3.bp.blogspot.com/-iQystOSnulo/WY6DLEKXx_I/AAAAAAAAAy0/Z7DuKImD3FcAgP55_FlqjUOoWXlmEVIHQCLcBGAs/s640/2.png"選擇性的標題")

```sh 
   如果真的要用到全域變數，當然就是直接綁在window，但盡量還是少使用全域變數比較好.

   window.GlobalVariable = 'hello world';
```

>Webpack除了JS模組與全域變數這個兩個觀念需要知道，基本上它模組的運作機制並不會影響我們所撰寫的程式碼.  


<br />

## 三、Webpack主要設定介紹

#### I.四個主要功能的作用理解:

![alt text](https://1.bp.blogspot.com/-QJtEluHnb5E/WY6jHGtW17I/AAAAAAAAAzE/U0ASp6cSg2MnvxiGR6gz77NVOwqYPbesACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-12%2B%25E4%25B8%258B%25E5%258D%25882.19.52.png"選擇性的標題")

搭配官網的圖片加上我自己的理解，來了解這些設定的作用，
- Entry  : 輸入的文件. (能有多個輸入口)
- Loader : 解析輸入的文件與文件相依的資源，進行相關處理.
- Plugin : 可以處理Loader做不到的事.
- Output : 管理輸出處理後的資源. (只能有一個輸出口)

運作過程 (這是我理解上的運作過程，因為官方文件沒特別比較Loader與Plugin)   
&emsp; Entry(輸入)  ->  Plugin (處理前)  ->  Loader(解析中)  ->  Plugin(處理後)  ->  Output(輸出)    

Plugin 的 處理前、處理後的有哪些例子呢？  
&emsp; 處理前：編譯前先刪除dist資料夾.  
&emsp; 處理後：編譯後抽出css成一個檔案.  

#### I.簡單範例介紹:

1.範例結構  

![alt text](https://3.bp.blogspot.com/-kiOJXcrKxSo/WY8sj649D5I/AAAAAAAAAzU/kObgUIWUU3Aj7-Jp3t5QA1JtpnUdqnDggCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258A%25E5%258D%258812.19.49.png"選擇性的標題")

```sh 
要做的事
  單純編譯scss，然後打包專案.

主要檔案內容

    1.index.html

        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset='utf-8'>
                <meta content='IE=edge,chrome=1' http-equiv='X-UA-Compatible'>
                <title></title>
                <meta content='' name='description'>
                <meta content='' name='author'>
                <meta content='width=device-width, initial-scale=1.0' name='viewport'>
            </head>
            <body>
                <p class="info">測試文字...</p>
            </body>
        </html>


    2.style.scss

        body {
            background:green;
            .info {
                font-size: 20px;
                color: burlywood;
            }
        }


    3.index.js

        import './style/scss/style.scss';

```



2.安裝 Webpack

```sh 
    npm install webpack -g

    npm install webpack -D
```

3.安裝webpack-dev-server (跑webserver用)

```sh 
    npm install webpack-dev-server -D  
```

4.撰寫簡單的 npm scripts
```sh 
    {
        ....,
        "scripts": {
            "start": "webpack-dev-server --open",              // 跑webserver，自動打開web. 
            "build": "webpack --config webpack.config.js"      // 跑webpack 指定 webpack.config.js 
        },
        ....
    } 

    npm run build => 進行打包
    npm run start => 跑webserver
```

5.撰寫基本的config架構，先配置devServer.
```sh 
    const path = require('path');

    module.exports = {
        devServer: {
            contentBase: './dist'
        },
        entry: {
            設定入口文件的地方...
        },
        output: {
            設定輸出文件的地方...
        },
        module: {
            rules: [
                設定Loader的地方...
            ]
        },
        plugins: [
            設定Plugin的地方...
        ]
    }
```

6.設定Entry  

```sh       
    module.exports = {
        ....,
        entry: {
            app: ['./src/index.js'],
        },
        ...
    }

    說明：
        因為Webpack只會處理JS，所以像是css都要藉由require或import，來讓Webpack的來處理.
        設定的方式 chunk : ['A檔案路徑','B檔案路徑',...] (打包成一個模組的意思)
        而這邊的scss是import在index.js，所以我們入口文件就指定index.js，
        另外我們的 chunk name 取為 app . 
```

7.設定output  

```sh 
    module.exports = {
        ....,
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'assets/[name].bundle.js',
            publicPath: '/',
        },
        ...
    }

    說明：
        path：輸出的地方.
        filename：設定檔名，[name]代表chunk，另外前面還有加路徑 assets/，所以會輸出到 dist/assets/
        publicPath：設定資源位置.
```

8.設定loader 
```sh 
    先安裝需要的套件
        npm install style-loader css-loader sass-loader node-sass  -D
```
```sh 
    loader有三種設定的方式：

        1.在config設定(最佳)：
            module.exports = {
                ....,
                module: {
                    rules: [
                        {
                            test: /\.(scss|css)$/,
                            use: [ 'style-loader', 'css-loader' , 'sass-loader' ]
                        }
                    ]
                }
                ...
            }       

            test：來源配對
            use：使用哪些loader來處理

            設定只要是scss和css檔案就會使用 style-loader、css-loader、sass-loader 進行處理.
            sass-loader：尋找處理scss轉成css.
            css-loader：尋找所有css.
            style-loader：module運行時，動態插入<style>...</style>到html.

            ps:執行順序是從右到左，處理完後就會往下一個丟 => style-loader <- css-loader <- sass-loader

        2.在require或import就設定loader
            index.js
                import 'style-loader!css-loader!sass-loader!./style/scss/style.scss';

        3.終端機打指令 跑 webpack.config.js 時，順便加loader設定. (基本上不會這樣做，除非本身有練英打的需求)
            webpack --module-bind 'scss=style-loader!css-loader!sass-loader';
```

9.設定plugin

```sh 
    安裝需要的套件
        npm install html-webpack-plugin -D
```
```sh 
    module.exports = {
        ...,
        plugins: [
            new HtmlWebpackPlugin({
                title: '首頁',
                filename: 'index.html',
                template:  'src/index.html',
                chunksSortMode: 'manual',
                minify: false,
                chunks: ['app']
            })
        ]
    }

    index.html
        <title><%= htmlWebpackPlugin.options.title %></title>

    說明：
        這是一個輸出html和加上我們打包後的js的script tag.
        title：設定html title 的地方，不過某些時候會失效. (請參考套件的文件)
        filename：設定檔案名稱.
        template：設定來源的template.
        chunksSortMode：設定插入script tag排序方式，manual:手動排序.
        minify：是否壓縮html.
        chunks：哪些chunks，這邊只有一個'app'，所以只會有一個插入的script tag.
```

> loader與plugin的更多參數設定內容，請參考官網或是套件介紹.

10.觀看輸出的檔案

```sh
    index.html

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset='utf-8'>
            <meta content='IE=edge,chrome=1' http-equiv='X-UA-Compatible'>
            <title>
            首頁
            </title>
            <meta content='' name='description'>
            <meta content='' name='author'>
            <meta content='width=device-width, initial-scale=1.0' name='viewport'>
        </head>
        <body>
        <p class="info">測試文字...</p>
            <script type="text/javascript" src="/assets/app.bundle.js"></script>
        </body>
    </html>

    說明：
         這邊看到沒有任何的css檔案被引入，因為都一起打包到app.bundle.js了，而當網頁運行app.bundle.js時，
         因為我們有使用到style-loader做處理，所以就會被動態插入到html.
```

![alt text](https://3.bp.blogspot.com/-Vsa3erfUXY4/WY9JEauAzjI/AAAAAAAAAzk/3ZI5QqDKaXwy2Pmkiahx2mPqh0Zzl054gCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258A%25E5%258D%25882.13.43.png"選擇性的標題")

<br />


## 三、Webpack-demo 內容介紹 
&emsp;看完前面兩個部分，基本上應該對Webpack會有初步了解，但這只是一小部分，建議還是去官網讀完教學文件，而這邊介紹的是這個webpack-demo的內容.

目前這個配置有的功能 (可以跳過第三部分，直接看webpack.config.js，有寫簡單的註解.)  
- 編譯前清除dist資料夾
- 轉譯es6與壓縮醜化js
- scss轉譯與把css抽出成一個檔案.
- images相關處理
- Jquery匯出成為全域變數
- 緩存

#### I.結構介紹:

![alt text](https://3.bp.blogspot.com/-kiOJXcrKxSo/WY8sj649D5I/AAAAAAAAAzU/kObgUIWUU3Aj7-Jp3t5QA1JtpnUdqnDggCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258A%25E5%258D%258812.19.49.png"選擇性的標題")

主要檔案介紹
```sh
    ./src/index.html

        <!DOCTYPE html>
        <html lang="en">
            <head>
                ...
            </head>
            <body>
                <div class="about">
                    <p id="info"></p>
                </div>
                <div>
                    <img width="200" height="200" src="./assets/img/demo.png" alt="">
                </div>
                <div>
                    <img src="./assets/img/demo3.png" alt="">
                </div>
            </body>
        </html>

        說明：
            這邊.info 會用 js 插字進去，另外還有示範圖片處理方式(css body有設背景圖).



    ./src/style/scss

        @import "reset";
        @import "pages/index";

        說明：
            這邊import是css reset 和 index的樣式.



    ./src/js/info.js

        export default class info {
            constructor() {
                this.name = 'joe';
            }
            getName() {
                return this.name;
            }
        }

        說明：
            一個簡單的clss，為了測試es6編譯.



    ./src/index.js

        import './style/scss/style.scss';
        import info from './js/info.js';

        let Info = new info();
        let author = Info.getName();

        document.getElementById("info").innerHTML = 'Hi , 這是一個簡單的 Webpack Demo  . by ' + author + ' .';

        說明：
            主要撰寫index.html相關程式碼的地方.



    ./src/js/jquery-plugin.js

        if (typeof jQuery === 'undefined') {
            throw new Error("Jquery Plugins\'s JavaScript requires jQuery")
        }

        +function ($) {
            var element = $('body');
            element.css('font-size', '30px');
        }(jQuery);

        說明：
            這邊是為了測試jquery是否有綁定到window上(全域).
            PS:通常依賴jquery的套件，開頭都會做那樣的判斷.            



    ./src/vendor.js
        import 'jquery';
        import './js/jquery-plugin.js';

        說明：        
            打第三方套件都打包在vendor裡.
```

#### I.開始設定config:

1.設置 devServer entry output

```sh
    const webpack = require('webpack');
    const path = require('path');

    module.exports = {
        devServer: {
            contentBase: './dist'
        },
        entry: {
            app: ['./src/index.js'],
            vendor: ['./src/vendor.js']
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'assets/[name].[chunkHash:6].bundle.js',
            publicPath: '/',
        },
        .....
    }

    說明
        這邊配置了兩個chunk，也就是說輸出的時候會有兩個JS檔案.
        chunkHash是等等用來做緩存會用到的.

```

<br />

2.配置清除dist資料夾的plugin

```sh
    安裝套件
        npm install clean-webpack-plugin -D
```
```sh
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    module.exports = {
        ...,
        plugins: [
            new CleanWebpackPlugin(['dist'], {
                "verbose": true
            })
        ]
    }

    說明
        verbose設置true時，當移除資料夾時，終端機就會有提示.

```

<br />

3.轉譯壓縮醜化JS
```sh
    安裝套件
        npm install babel-loader babel-core babel-preset-env -D
        npm install uglifyjs-webpack-plugin  -D
```

```sh
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

    module: {
        ...,
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ],
    plugins: [
            new UglifyJSPlugin({
                mangle: {
                    // Skip mangling these
                    except: ['$super', '$', 'exports', 'require', 'default']
                }
            })
        ] 
    }
```

<br />

4.把css抽出成一個單獨檔案
```sh
    安裝套件
        npm install style-loader css-loader sass-loader node-sass -D
        npm install extract-text-webpack-plugin  -D
```

```sh
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    module: {
        ...,
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader',
                }),
            }
        ],
    plugins: [
            ...,
            new ExtractTextPlugin('assets/[name].[contenthash:6].css')
        ] 
    }

    說明
        這邊用了extract-text-webpack-plugin這個套件，可以把css變成一個檔案，
        這邊看到plugins裡有設定檔案輸出的位置，而rules裡有做一個傳給它的設定.

        [name] => 因為css是從index.js抽出來的，而index.js又是放在app這個chunk，所以檔名會是 app.css
        [contenthash:6] => 判斷檔案內容，計算出x位數的hash. 

                           hash 目前看官方文件有三種計算方式
                                1.hash:根據build的過程，計算的hash. (這是個人的理解，官方文件沒看到詳細的敘述.)
                                2.chunkhash:根據chunk內容計算的hash.
                                3.hashcontent:檔案內容計算的hash.
                                
        PS:因為app.css這個檔案裡面，只有單純的css，不會再包一層module做運作，所以使用contenthash.
```

<br />

5.處理images
```sh
    安裝套件
        npm install file-loader url-loader -D    // url-loader是基於file-loader的，所以也要一起安裝.
        npm install image-webpack-loader -D      // 照片壓縮
        npm install html-withimg-loader -D       // 處理html裡的img url
```

```sh
    有兩個地方使用到照片

    src/style/scss/pages/_index.scss 

        body {
            background-image: url(../../assets/img/demo2.jpg);
        }

    src/index.html

        <body>
            .....
            <div>
                <img width="200" height="200" src="./assets/img/demo.png" alt="">
            </div>
            <div>
                <img src="./assets/img/demo3.png" alt="">
            </div>
        </body>


    配置

    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    module: {
        ...,
        rules: [
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
            {
                test: /\.(htm|html)$/i,
                use: {
                        loader: 'html-withimg-loader',
                        options: {
                            min: false
                        }
                    }
            },
        ]
    }


    說明
        url-loader：如果檔案小於某xxx大小就會轉成 data url，就可以少一個http request. (這邊是設定小於10kb)

        image-webpack-loader：壓縮圖片.
        PS:要記得運作的過程是從右到左，image-webpack-loader -> url-loader . 

        html-withimg-loader：處理html img有src的圖片.
        PS:因為html沒有像css一樣被import，所以要另外加一個判斷html裡的img src.

```

效果如下圖，而因為demo3已經轉成data url了，所以也不會被打包到dist/assets/images裡.

![alt text](https://4.bp.blogspot.com/-a6Ip7UJHNow/WZACAcjGBiI/AAAAAAAAAz8/9Vfm3CG8mkcWQA_kfGqLTU6K48WJX5B-QCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258B%25E5%258D%25883.38.15.png"選擇性的標題")


<br />


6.處理Jquery全域變數問題

```sh
    npm install expose-loader -D
```
問題說明  
&emsp;因為jquery源碼也有對module做了些配置，簡單的說如果jquery源碼被包在規範的module，它就不會綁在window而是變成匯出module. 

![alt text](https://4.bp.blogspot.com/-5qsMvouFZvI/WZAFoPTzKWI/AAAAAAAAA0M/nIeTxaGXnWkUdvgorrOaSjJ-OZcaljzvACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258B%25E5%258D%25883.50.55.png"選擇性的標題")

![alt text](https://3.bp.blogspot.com/-z_SXDKGawZ4/WZAFoFKBuNI/AAAAAAAAA0I/ben1500_y9oPiYRhhgL0jMazDzxlLXEEgCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258B%25E5%258D%25883.53.38.png"選擇性的標題")    

影響   
&emsp;但是因為依賴jquery的相關套件是依賴著window綁的jquery，所以就會造成在全域找不到jquery而報錯.

處理方式
```sh
    module: {
        rules: [
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
    }
```

做了什麼事？  
&emsp;如下圖，在匯出module時，會再多綁定到window上.  

![alt text](https://2.bp.blogspot.com/-d2nTqwBh9zo/WZAJEmkEwDI/AAAAAAAAA0Y/zFwjSot6zA87zbPivmY1ZzZbgB1q_3LDQCLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258B%25E5%258D%25884.06.10.png"選擇性的標題")   


<br />


7.緩存設定  
&emsp;前提  
&emsp;&emsp;因為瀏覽器有緩存的機制，如果路徑或檔名沒有改變的話，就會使用緩存中的資料，導致於有時候不能及時的更新，因為被緩存住了.  
&emsp;&emsp;所以都會用通常都會自己戳上版號，瀏覽器重新下載伺服器新的檔案. =>  app.js?v=0.2

先複習一下hash的三種計算方式  
- hash:根據build的過程，計算的hash. (這是個人的理解，官方文件沒看到詳細的敘述.)
- chunkhash:根據chunk內容計算的hash.
- hashcontent:檔案內容計算的hash.

而我們要做緩存機制的有三個(打包出來後的)

app.js：經常變動.    
style.css：不一定.    
vendor.js：不常變動.  

7.1 處理css檔案的hash
```sh   
    因為檔案裡只有css，所以很單純，直接用contenthash就可以.
    new ExtractTextPlugin('assets/[name].[contenthash:6].css'),
```
7.2 處理js檔案的hash

&emsp;先我們當然是選擇使用chunkhash.依照個別模組內容hash的計算.  
```sh 
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'assets/[name].[chunkHash:6].bundle.js',
        publicPath: '/',
    }
```
&emsp;但還要在外另加幾個步驟.
```sh 
    plugins: [
        new webpack.HashedModuleIdsPlugin(),           //(3)
        new webpack.optimize.CommonsChunkPlugin({      //(2)
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({      //(1)
            name: 'runtime',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html'),
            minify: false
        }),

    說明
       CommonsChunkPlugin的功能是可以提取共用代碼的部分.(詳細說明請參考官方文件)

        (1).如果是指定一個不存在的chunks，提出runtime 和 manifest的部分.
            PS:runtime 和 manifest 大致是每個chunk變成module後，彼此如何互相交流的部分.
            所以必須把他們提出來，不然就算只改某chunk，其它chunk也會受影響，以至於用了[chunkHash]也是無效.
            (要記得runtime.xxx.js在index.html引入的時候，是必須被放在第一個)

        (2).官方建議把用到的第三方套件引入到vendor，然後使用CommonsChunkPlugin做處理.
            PS:這步驟算是一種規範，因為會放在vendor裡的，通常也是通用的部分.
        
        (3).如果有新增或移除import的時候，也會影響到各chunk的moduleId.
            所以app.js只要有import的變動，vendor的moduleId也會受到影響，就會被重新計算chunkhash.
            而解決的方面就是HashedModuleIdsPlugin來處理moduleId的這個問題.
       
```

![alt text](https://3.bp.blogspot.com/-oI0niK8vX5E/WZAjrgcaT5I/AAAAAAAAA0o/MmtZTA4t8q4zQSSOczSg6nRCw2-MNv1EgCLcBGAs/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-13%2B%25E4%25B8%258B%25E5%258D%25886.00.48.png"選擇性的標題") 


<br />

> 此文章比較偏向筆記，擔心有遺漏之處，如有錯誤或建言，歡迎在[issues](https://github.com/JiaHongL/webpack-demo/issues) 提出，感謝.