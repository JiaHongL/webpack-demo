console.log(typeof GlobalVariable);

// import 'style-loader!css-loader!sass-loader!./style/scss/style.scss';
// webpack --module-bind 'scss=style-loader!css-loader!sass-loader';

import './style/scss/style.scss';
import info from './js/info.js';

let Info = new info();
let author = Info.getName();

document.getElementById("info").innerHTML = 'Hi , 這是一個簡單的 Webpack Demo  . by ' + author + ' .';