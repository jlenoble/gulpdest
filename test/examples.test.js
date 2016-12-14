import GulpDest from '../src/gulpdest';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import gulp from 'gulp';
import path from 'path';
import Muter, {muted} from 'muter';
import equalStreamContents from 'equal-stream-contents';

chai.use(chaiAsPromised);

describe('Testing README.md examples', function() {

  it(`Usage example`, function() {
    const dest = new GulpDest('build');
    const glob = 'src/**/*.js';
    const stream = gulp.src(glob);

    const gg = dest.dest(stream, glob); // Writes stream to 'build' and returns a GulpGlob object

    return gg.toPromise().then(globs => {
      const muter = Muter(console, 'log');

      return Promise.all([
        muted(muter, function() {
          const cwd = process.cwd();
          return expect(gg.list()).to.eventually.eql([
            path.join(cwd, 'build', 'src/gulpdest.js'),
            path.join(cwd, 'build', 'src/simple-gulpdest.js'),
          ]);
        })(),
        equalStreamContents(gg.src(), gulp.src(path.join('build', glob))),
      ]);
    });
  });

});
