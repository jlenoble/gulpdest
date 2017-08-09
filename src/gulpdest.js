import isString from 'is-string';
import gulp from 'gulp';
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

    const _base = process.cwd();
    const _dest = path.relative(_base, dst);

    Object.defineProperties(this, {
      destination: {
        value: _dest,
      },
      base: {
        value: _base,
      },
    });
  }

  dest (stream, {glob, cwd, base} = {}) {
    const glb = new GulpGlob([glob, {cwd, base}]);

    return glb.dest(this.destination, {
      ready: () => {
        return new Promise((resolve, reject) => {
          stream.pipe(gulp.dest(this.destination))
            .on('error', reject)
            .on('end', resolve);
        });
      },
    });
  }
}

const GulpDest = SingletonFactory(SimpleGulpDest, // eslint-disable-line new-cap
  ['literal'], {
    preprocess ([dst]) {
      checkDest(dst);
      return [path.isAbsolute(dst) ? dst : path.join(process.cwd(), dst)];
    },
  });

export default GulpDest;
