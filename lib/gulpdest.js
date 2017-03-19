'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleGulpdest = require('./simple-gulpdest');

var _simpleGulpdest2 = _interopRequireDefault(_simpleGulpdest);

var _polyton = require('polyton');

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var GulpDest = (0, _polyton.PolytonFactory)( // eslint-disable-line new-cap
_simpleGulpdest2.default, ['literal'], [{
  unordered: true
}], {
  preprocess: function preprocess(_args) {
    var args = _args.length ? _args : [[undefined]];
    var preArgs = [];
    args.forEach(function (dest) {
      var dst = dest[0];
      if (dest.length !== 1) {
        dst = dest;
      }
      if ((0, _isString2.default)(dst) && dst !== '') {
        dst = _path2.default.relative(process.cwd(), dst);
        if (!preArgs.includes(dst)) {
          preArgs.push(dst);
        }
      } else {
        throw new TypeError('Invalid dest element: "' + dst + '"');
      }
    });
    return preArgs.map(function (arg) {
      return [arg];
    });
  },
  properties: {
    destination: {
      get: function get() {
        return this.map(function (el) {
          return el.destination;
        }).reduce(function (array, dest) {
          return array.concat(dest);
        }, []);
      }
    }
  },
  extend: {
    dest: function dest(stream, glob) {
      var cwd = process.cwd();
      var glb = Array.isArray(glob) ? glob : [glob];
      glb = glb.map(function (gl) {
        return _path2.default.relative(cwd, gl);
      });

      return new (Function.prototype.bind.apply(_gulpglob2.default, [null].concat(_toConsumableArray(this.map(function (dest) {
        return dest._globArgs(stream, glb);
      })))))();
    }
  }
});

exports.default = GulpDest;
module.exports = exports['default'];