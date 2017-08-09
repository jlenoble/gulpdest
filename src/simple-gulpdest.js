import isString from 'is-string';
import gulp from 'gulp';
import GulpGlob from 'gulpglob';

class SimpleGulpDest {
  constructor (dst) {
    if (!isString(dst) || dst === '') {
      throw new TypeError('Invalid dest element: "' + dst + '"');
    }

    Object.defineProperties(this, {
      destination: {
        value: dst,
      },
    });
  }

  dest (stream, {glob, cwd, base}) {
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

export default SimpleGulpDest;
