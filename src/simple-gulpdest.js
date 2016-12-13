import isString from 'is-string';
import gulp from 'gulp';
import path from 'path';
import GulpGlob from 'gulpglob';

class SimpleGulpDest {

  constructor (dst) {
    if (!isString(dst) || dst === '') {
      throw new TypeError('Invalid dest element: "' + dst + '"');
    }

    const _base = process.cwd();
    const _dest = path.relative(_base, dst);

    Object.defineProperties(this, {
      destination: {
        get () {
          return _dest;
        },
      },
      base: {
        get () {
          return _base;
        },
      },
    });
  }

  dest (stream, originalGlob) {
    return new GulpGlob(this._globArgs(stream, originalGlob));
  }

  _globArgs (stream, originalGlob) {
    const glob = Array.isArray(originalGlob) ? originalGlob : [originalGlob];
    return [
      glob.map(glb => {
        let a = glb.split('**');
        a[0] = path.join(this.destination, a[0]);

        if (a.length === 1) {
          return a[0];
        } else {
          return path.join(a[0], '**', a[1]);
        }
      }), {
        ready: () => {
          return new Promise((resolve, reject) => {
            stream.pipe(gulp.dest(this.destination))
              .on('error', reject)
              .on('end', resolve);
          });
        },
      },
    ];
  }

}

export default SimpleGulpDest;
