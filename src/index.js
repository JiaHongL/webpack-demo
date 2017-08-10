if (typeof jQuery === 'undefined') {
    throw new Error('Jquery Plugins\'s JavaScript requires jQuery')
}else{
    console.log('jQuery is ok');
}

import './style/scss/style.scss';
import info from './js/myjs.js';

let Info = new info();
let author = Info.getName();
document.getElementById("info").innerHTML = 'hi , my name is &nbsp;' + author;
