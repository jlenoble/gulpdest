import isString from 'is-string';
import gulp from 'gulp';
import through from 'through2';
import GulpGlob from 'gulpglob';
import PolyPath from 'polypath';
import path from 'path';
import {SingletonFactory} from 'singletons';
import touchMs from 'touch-ms';

const checkDest = dst => {
  if (!isString(dst) || dst === '') {
    throw new TypeError('Invalid dest element: "' + dst + '"');
  }
};

export class SimpleGulpDest {
  constructor (dst) {
    checkDest(dst);

    Object.defineProperties(this, {
      destination: {
        value: path.isAbsolute(dst) ? dst : path.join(process.cwd(),
          path.relative(process.cwd(), dst)),
      },
    });
  }

  dest (stream, {glob, cwd, base} = {}) {
    const glb = new GulpGlob([glob, {cwd, base}]);

    return glb.dest(this.destination, {
      ready: () => {
        return new Promise((resolve, reject) => {
          const files = [];
          stream
            .pipe(through.obj(function (file, enc, callback) {
              if (file.path) {
                files.push(file.path);
              }
              callback(null, file);
            }))
            .pipe(gulp.dest(this.destination))
            .on('error', reject)
            .on('end', () => {
              if (files.length) {
                resolve(new PolyPath(...files).rebase(this.destination).paths);
              } else {
                resolve([]);
              }
            });
        }).then(files => Promise.all(files.map(file => touchMs(file))));
      },
    });
  }
}

const GulpDest = SingletonFactory(SimpleGulpDest, // eslint-disable-line new-cap
  ['literal'], {
    preprocess ([dst]) {
      let dest = dst;
      if (dst instanceof SimpleGulpDest) {
        dest = dest.destination;
      } else {
        checkDest(dest);
        if (!path.isAbsolute(dest)) {
          dest = path.join(process.cwd(), dest);
        }
      }
      return [dest];
    },
  });

export default GulpDest;
