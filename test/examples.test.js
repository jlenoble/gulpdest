import GulpDest from '../src/gulpdest';
import {expect} from 'chai';
import gulp from 'gulp';
import path from 'path';
import Muter, {muted} from 'muter';
import equalStreamContents from 'equal-stream-contents';

describe('Testing README.md examples', function () {
  it(`Usage example`, function () {
    const dest = new GulpDest('build');
    const glob = 'src/**/*.js';
    const stream = gulp.src(glob);

    const gg = dest.dest(stream, {glob}); // Writes stream to 'build' and
    // returns a GulpGlob object

    return gg.toPromise().then(globs => {
      const muter = Muter(console, 'log'); // eslint-disable-line new-cap

      return Promise.all([
        muted(muter, function () {
          const cwd = process.cwd();
          return gg.list().then(list => {
            expect(list).to.eql([
              path.join(cwd, 'build', 'src/gulpdest.js'),
            ]);
          });
        })(),
        equalStreamContents(gg.src(), gulp.src(path.join('build', glob))),
      ]);
    });
  });
});
