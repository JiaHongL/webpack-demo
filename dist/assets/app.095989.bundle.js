webpackJsonp([1],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("lVK7");


/***/ }),

/***/ "T+RE":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var info = function () {
    function info() {
        _classCallCheck(this, info);

        this.name = 'joe';
    }

    _createClass(info, [{
        key: 'getName',
        value: function getName() {
            return this.name;
        }
    }]);

    return info;
}();

exports.default = info;

/***/ }),

/***/ "lVK7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__("y+p0");

var _info = __webpack_require__("T+RE");

var _info2 = _interopRequireDefault(_info);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(typeof GlobalVariable === 'undefined' ? 'undefined' : _typeof(GlobalVariable));

// import 'style-loader!css-loader!sass-loader!./style/scss/style.scss';
// webpack --module-bind 'scss=style-loader!css-loader!sass-loader';

var Info = new _info2.default();
var author = Info.getName();

document.getElementById("info").innerHTML = 'Hi , 這是一個簡單的 Webpack Demo  . by ' + author + ' .';

/***/ }),

/***/ "y+p0":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[0]);