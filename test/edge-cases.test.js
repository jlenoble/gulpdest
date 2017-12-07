import GulpDest from '../src/gulpdest';
import {expect} from 'chai';
import gulp from 'gulp';
import newer from 'gulp-newer';
import {tmpDir} from 'cleanup-wrapper';

describe('Testing edge cases', function () {
  it(`Instantiating GulpDest with no arguments`, function () {
    // Correct behavior for no args...
    expect(() => new GulpDest(undefined)).to.throw(TypeError,
      'Invalid dest element: "undefined"');

    // ... But with actual no args, instantiating used to throw:
    // TypeError: Cannot read property 'Symbol()' of undefined
    expect(() => new GulpDest()).to.throw(TypeError,
      'Invalid dest element: "undefined"');
  });

  it(`Desting empty stream`, tmpDir('build8', function () {
    const glob = 'src/gulpdest.js';
    const stream = gulp.src(glob, {base: process.cwd()})
      .pipe(newer(process.cwd())); // Empties stream

    // Used to throw with error TypeError: Expected a string, got undefined
    // Due to lack of files passed internally to PolyPath
    return new GulpDest('build8').dest(stream, {glob}).isReady();
  }));
});
