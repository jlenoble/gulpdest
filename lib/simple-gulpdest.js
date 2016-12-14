'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleGulpDest = function () {
  function SimpleGulpDest(dst) {
    _classCallCheck(this, SimpleGulpDest);

    if (!(0, _isString2.default)(dst) || dst === '') {
      throw new TypeError('Invalid dest element: "' + dst + '"');
    }

    var _base = process.cwd();
    var _dest = _path2.default.relative(_base, dst);

    Object.defineProperties(this, {
      destination: {
        get: function get() {
          return _dest;
        }
      },
      base: {
        get: function get() {
          return _base;
        }
      }
    });
  }

  _createClass(SimpleGulpDest, [{
    key: 'dest',
    value: function dest(stream, originalGlob) {
      return new _gulpglob2.default(this._globArgs(stream, originalGlob));
    }
  }, {
    key: '_globArgs',
    value: function _globArgs(stream, originalGlob) {
      var _this = this;

      var glob = Array.isArray(originalGlob) ? originalGlob : [originalGlob];
      return [glob.map(function (glb) {
        var a = glb.split('**');
        a[0] = _path2.default.join(_this.destination, a[0]);

        if (a.length === 1) {
          return a[0];
        } else {
          return _path2.default.join(a[0], '**', a[1]);
        }
      }), {
        ready: function ready() {
          return new Promise(function (resolve, reject) {
            stream.pipe(_gulp2.default.dest(_this.destination)).on('error', reject).on('end', resolve);
          });
        }
      }];
    }
  }]);

  return SimpleGulpDest;
}();

exports.default = SimpleGulpDest;
module.exports = exports['default'];