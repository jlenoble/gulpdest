import GulpDest from '../src/gulpdest';
import {expect} from 'chai';
import gulp from 'gulp';
import path from 'path';
import Muter, {muted} from 'muter';
import equalStreamContents from 'equal-stream-contents';
import {tmpDir} from 'cleanup-wrapper';

describe('Testing README.md examples', function () {
  it(`Usage example`, tmpDir('build4', function () {
    const dest = new GulpDest('build4');
    const glob = 'src/**/*.js';
    const stream = gulp.src(glob, {base: process.cwd()});

    const gg = dest.dest(stream, {glob}); // Writes stream to 'build' and
    // returns a GulpGlob object

    return gg.toPromise().then(() => {
      const muter = Muter(console, 'log'); // eslint-disable-line new-cap

      return Promise.all([
        muted(muter, function () {
          const cwd = process.cwd();
          return gg.list().then(list => {
            expect(list).to.eql([
              path.join(cwd, 'build4', 'src/gulpdest.js'),
            ]);
          });
        })(),
        equalStreamContents(gg.src(), gulp.src(path.join('build4', glob))),
      ]);
    });
  }));
});
