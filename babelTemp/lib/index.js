"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _context;

/**
 * 文章链接
 * https://juejin.im/post/5ddff3abe51d4502d56bd143
 */
var isHas = (0, _includes.default)(_context = [1, 2, 3]).call(_context, 2);
var p = new _promise.default(function (resolve, reject) {
  resolve(100);
}); // const func = async () => {
//   await console.log('func')
// }
// class Point {
//   constructor(x, y) {
//     this.x = x
//     this.y = y
//   }
//   getX() {
//     return this.x
//   }
// }
// let cp = new ColorPoint(25, 8)