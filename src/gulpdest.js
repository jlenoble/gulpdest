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
