import path from 'path';
import gulp from 'gulp';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import SimpleGulpDest from '../src/simple-gulpdest';
import {SimpleGulpGlob} from 'gulpglob';
import {invalidArgs, validArgs, equalFileContents} from './helpers';
import {tmpDir} from 'cleanup-wrapper';

chai.use(chaiAsPromised);

describe('SimpleGulpDest is a class encapsulting gulp.dest', function() {

  it(`A SimpleGulpDest instance can't be initialized from an invalid dest argument`,
    function() {
      invalidArgs().forEach(arg => {
        expect(() => new SimpleGulpDest(arg))
          .to.throw(TypeError, /Invalid dest element:/);
      });
  });

  it('A SimpleGulpDest instance has a non-writable member destination',
  function() {
    const args = validArgs();
    args.forEach(arg => {
      const dst = new SimpleGulpDest(arg);
      expect(dst.destination).to.equal(path.relative(process.cwd(), arg));
      expect(() => {
        dst.destination = 'tmp';
      }).to.throw(TypeError, /Cannot set property destination/);
    });
  });

  it('A SimpleGulpDest instance can write streams', tmpDir(validArgs(),
  function() {
    this.timeout(5000);
    let run = Promise.resolve();
    validArgs().forEach(dest => {
      const func = function (dest) {
        const glob = 'src/**/*.js';
        const stream = gulp.src(glob);
        const dst = new SimpleGulpDest(dest);

        const glb = dst.dest(stream, glob);

        return glb.toPromise().then(globs => {
          return Promise.all(globs.map(glob => {
            return equalFileContents(glob.glob, dest);
          }));
        });
      };
      run = run.then(func.bind(undefined, dest));
    });
    return run;
  }));

});
