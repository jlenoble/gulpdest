import isString from 'is-string';
import gulp from 'gulp';
import fs from 'fs';
import nodeGlob from 'glob';
import GulpGlob from 'gulpglob';
import path from 'path';
import {SingletonFactory} from 'singletons';

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

    const destGlb = glb.dest(this.destination, {
      ready: () => {
        return new Promise((resolve, reject) => {
          stream
            .pipe(gulp.dest(this.destination))
            .on('error', reject)
            .on('end', resolve);
        }).then(() => Promise.all(destGlb.paths.map(path => {
          return new Promise((resolve, reject) => {
            nodeGlob(path, (err, files) => {
              if (err) {
                return reject(err);
              }
              return Promise.all(files.map(file => {
                return new Promise((resolve, reject) => {
                  const date = new Date();
                  fs.utimes(file, date, date, err => {
                    if (err) {
                      return reject(err);
                    }
                    resolve();
                  });
                });
              })).then(resolve, reject);
            });
          });
        })));
      },
    });

    return destGlb;
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
