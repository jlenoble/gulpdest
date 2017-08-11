import gulp from 'gulp';
import path from 'path';
import {expect} from 'chai';
import GulpDest from '../src/gulpdest';
import {invalidArgs, validArgs} from './helpers';
import {tmpDir} from 'cleanup-wrapper';
import equalFileContents from 'equal-file-contents';

const cwd = process.cwd();

describe('GulpDest is a class encapsulting gulp.dest', function () {
  it(`A GulpDest instance can't be initialized from an invalid dest argument`,
    function () {
      invalidArgs().forEach(arg => {
        expect(() => new GulpDest(arg))
          .to.throw(TypeError, /Invalid dest element:/);
      });
    });

  it('A GulpDest instance has a non-writable member destination', function () {
    validArgs().forEach(arg => {
      const dst = new GulpDest(arg);
      expect(dst.destination).to.equal(path.join(process.cwd(),
        path.relative(cwd, arg)));
      expect(() => {
        dst.destination = 'tmp';
      }).to.throw(TypeError,
        /Cannot assign to read only property 'destination'/);
    });
  });

  it('A GulpDest instance can write streams', tmpDir(validArgs(), function () {
    this.timeout(5000); // eslint-disable-line no-invalid-this
    const glob = 'src/**/*.js';
    const args = validArgs();
    const dests = args.map(arg => {
      const stream = gulp.src(glob, {base: cwd});
      return (new GulpDest(arg)).dest(stream, {glob});
    });

    return Promise.all(dests.map((dest, i) => {
      return dest.isReady().then(() =>
        equalFileContents(dest.glob, args[i]));
    }));
  }));
});
