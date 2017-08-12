## ㄧ、前提
&emsp; 這是一個簡單介紹webpack設定的Demo，基本上都是從官網文件介紹的方式來進行配置.    
>使用 webpack 3.4.1

<br />

## 二、何謂Webpack模組化？
 
&emsp; webpack是一套前端模組化的打包工具，較適合用來打包以SPA(Single Page Application)為架構的專案，但它不只是單純的進行打包，而是可以把所有資源進行模組化後，來進行webpack本身的模組隔離與載入運作功能，這樣講可能很抽象，我們來看下面這個打包的例子.  

```sh 
我們有兩個JS檔案和一個index.html，藉由webpack打包後，會插入兩個script tag到index.html.(先不管webpack如何打包)

1.hello.js 內容

    var GlobalVariable = 'hello world';
    console.log(GlobalVariable);
    console.log(typeof GlobalVariable);


2.index.js 內容

    console.log(typeof GlobalVariable);


3.index.html:

    <html class='no-js' lang='en'>
        <head></head>
        <body>
            <script type="text/javascript" src="/assets/hello.bundle.js"></script>
            <script type="text/javascript" src="/assets/index.bundle.js"></script>
        </body>
    </html>

還未理解模組化打包的情況下，我們會認為它只是進行壓縮醜化之類的打包而已，而會預期GlobalVariable會是個全域變數.

覺得的結果會是
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

>Webpack除了JS模組與全域變數這個觀念需要理解，基本上模組的運作機制並不會影響我們所撰寫的程式碼.  


<br />

## 三、Webpack主要設定介紹

#### I.四個主要功能的作用理解:

![alt text](https://1.bp.blogspot.com/-QJtEluHnb5E/WY6jHGtW17I/AAAAAAAAAzE/U0ASp6cSg2MnvxiGR6gz77NVOwqYPbesACLcBGAs/s640/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7%2B2017-08-12%2B%25E4%25B8%258B%25E5%258D%25882.19.52.png"選擇性的標題")

先搭配官網的圖片加上我自己的理解，來了解這些設定的作用，
- Entry  : 輸入的文件. (能有多個輸入口)
- Loader : 解析輸入的文件與文件相依的資源，進行相關處理.
- Plugin : 可以處理Loader做不到的事.
- Output : 管理輸出處理後資源. (只能有一個輸出口)

運作過程  
&emsp; Entry(輸入)  ->  Plugin (處理前)  ->  Loader(處理中)  ->  Plugin(處理後)  ->  Output(輸出)  

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
            app: ['src/index.js'],
        },
        ...
    }

    說明：
        因為Webpack只會處理JS，所以像是css都要藉由require或import，來讓Webpack的來處理.
        設定的方式 chunk : ['A檔案路徑','B檔案路徑',...]
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