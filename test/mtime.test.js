import GulpDest from '../src/gulpdest';
import {expect} from 'chai';
import gulp from 'gulp';
import {Stator} from 'stat-again';
import {tmpDir} from 'cleanup-wrapper';

describe('Testing mtime and atime touching', function () {
  it(`mtime is updated`, tmpDir('build3', function () {
    const dest = new GulpDest('build3');
    const glob = 'src/gulpdest.js';
    const glob2 = 'build3/src/gulpdest.js';
    const stream = gulp.src(glob, {base: process.cwd()});
    const stator = new Stator(glob);
    const stator2 = new Stator(glob2);

    const gg = dest.dest(stream, {glob}); // Writes stream to 'build3' and
    // returns a GulpGlob object

    return gg.toPromise().then(() => stator2.isNewerThan(stator)).then(yes => {
      expect(yes).to.be.true;
    });
  }));
});
