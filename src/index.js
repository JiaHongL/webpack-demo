// import 'style-loader!css-loader!sass-loader!./style/scss/style.scss';
// webpack --module-bind 'scss=style-loader!css-loader!sass-loader';

import './style/scss/style.scss';

import info from './js/info.js';

let Info = new info();
let author = Info.getName();

document.getElementById("info").innerHTML = 'hi , my name is &nbsp;' + author + ' .';
