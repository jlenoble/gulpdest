import path from 'path';
import gulp from 'gulp';
import {expect} from 'chai';
import GulpDest from '../src/gulpdest';
import {invalidArgs, validArgs, equalFileContents} from './helpers';
import {tmpDir} from 'cleanup-wrapper';

const cwd = process.cwd();

describe('GulpDest is a class encapsulting gulp.dest', function() {

  it(`A GulpDest instance can't be initialized from an invalid dest argument`,
    function() {
      invalidArgs().forEach(arg => {
        expect(() => new GulpDest(arg))
          .to.throw(TypeError, /Invalid dest element:/);
      });
  });

  it('A GulpDest instance has a non-writable member destination', function() {
    const args = validArgs();
    args.forEach(arg => {
      const dst = new GulpDest(arg);
      let dsts = Array.isArray(arg) ? arg : [arg];
      dsts = dsts.map(d => path.relative(cwd, d));
      expect(dst.destination).to.eql(dsts);
      expect(() => {
        dst.destination = 'tmp';
      }).to.throw(TypeError, /Cannot set property destination/);
    });
  });

  it('A GulpDest instance can write streams', tmpDir(validArgs(), function() {
    this.timeout(5000);
    const glob = 'src/**/*.js';
    const stream = gulp.src(glob);
    const dests = validArgs();
    const dst = new GulpDest(...dests);

    const glb = dst.dest(stream, glob);

    return glb.toPromise().then(globs => {
      return Promise.all(globs.map((glob, i) => {
        return equalFileContents(glob.glob, dests[i]);
      }));
    });
  }));

});
