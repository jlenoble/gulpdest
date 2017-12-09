'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleGulpDest = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

var _polypath = require('polypath');

var _polypath2 = _interopRequireDefault(_polypath);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _singletons = require('singletons');

var _touchMs = require('touch-ms');

var _touchMs2 = _interopRequireDefault(_touchMs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var checkDest = function checkDest(dst) {
  if (!(0, _isString2.default)(dst) || dst === '') {
    throw new TypeError('Invalid dest element: "' + dst + '"');
  }
};

var SimpleGulpDest = exports.SimpleGulpDest = function () {
  function SimpleGulpDest(dst) {
    _classCallCheck(this, SimpleGulpDest);

    checkDest(dst);

    Object.defineProperties(this, {
      destination: {
        value: _path2.default.isAbsolute(dst) ? dst : _path2.default.join(process.cwd(), _path2.default.relative(process.cwd(), dst))
      }
    });
  }

  _createClass(SimpleGulpDest, [{
    key: 'dest',
    value: function dest(stream) {
      var _this = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          glob = _ref.glob,
          cwd = _ref.cwd,
          base = _ref.base;

      var glb = new _gulpglob2.default([glob, { cwd: cwd, base: base }]);

      return glb.dest(this.destination, {
        ready: function ready() {
          return new Promise(function (resolve, reject) {
            var files = [];
            stream.pipe(_through2.default.obj(function (file, enc, callback) {
              if (file.path) {
                files.push(file.path);
              }
              callback(null, file);
            })).pipe(_gulp2.default.dest(_this.destination)).on('error', reject).on('end', function () {
              if (files.length) {
                resolve(new (Function.prototype.bind.apply(_polypath2.default, [null].concat(files)))().rebase(_this.destination).paths);
              } else {
                resolve([]);
              }
            });
          }).then(function (files) {
            return Promise.all(files.map(function (file) {
              return (0, _touchMs2.default)(file);
            }));
          });
        }
      });
    }
  }]);

  return SimpleGulpDest;
}();

var GulpDest = (0, _singletons.SingletonFactory)(SimpleGulpDest, // eslint-disable-line new-cap
['literal'], {
  preprocess: function preprocess(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        dst = _ref3[0];

    var dest = dst;
    if (dst instanceof SimpleGulpDest) {
      dest = dest.destination;
    } else {
      checkDest(dest);
      if (!_path2.default.isAbsolute(dest)) {
        dest = _path2.default.join(process.cwd(), dest);
      }
    }
    return [dest];
  }
});

exports.default = GulpDest;