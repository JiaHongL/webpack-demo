console.log(typeof GlobalVariable);

import './style/scss/style.scss';
import info from './js/info.js';

let Info = new info();
let author = Info.getName();

document.getElementById("info").innerHTML = 'Hi , 這是一個簡單的 Webpack Demo  . by ' + author + ' .';