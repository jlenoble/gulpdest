import gulp from 'gulp';
import {expect} from 'chai';
import SimpleGulpDest from '../src/simple-gulpdest';
import {invalidArgs, validArgs} from './helpers';
import {tmpDir} from 'cleanup-wrapper';
import equalFileContents from 'equal-file-contents';

describe('SimpleGulpDest is a class encapsulting gulp.dest', function () {
  it(`A SimpleGulpDest instance can't be initialized from an invalid dest` +
  `argument`, function () {
    invalidArgs().forEach(arg => {
      expect(() => new SimpleGulpDest(arg))
        .to.throw(TypeError, /Invalid dest element:/);
    });
  });

  it('A SimpleGulpDest instance has a non-writable member destination',
    function () {
      const args = validArgs();
      args.forEach(arg => {
        const dst = new SimpleGulpDest(arg);
        expect(() => {
          dst.destination = 'tmp';
        }).to.throw(TypeError,
          /Cannot assign to read only property 'destination'/);
      });
    });

  it('A SimpleGulpDest instance can write streams', tmpDir(validArgs(),
    function () {
      this.timeout(5000); // eslint-disable-line no-invalid-this
      let run = Promise.resolve();
      validArgs().forEach(dest => {
        const func = function (dest) {
          const glob = 'src/**/*.js';
          const stream = gulp.src(glob, {base: process.cwd()});
          const dst = new SimpleGulpDest(dest);

          const glb = dst.dest(stream, {glob});

          return glb.toPromise().then(glb => {
            return equalFileContents(glb.glob, dest);
          });
        };
        run = run.then(func.bind(undefined, dest));
      });
      return run;
    }));
});
